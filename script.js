const BASE_URL = "https://auth-backend-aeiw.onrender.com"; // ❗ NO trailing slash

// ================= LOGIN =================
async function login() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  try {
    const res = await fetch(BASE_URL + "/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "profile.html";
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Login failed ❌");
    console.log(err);
  }
}

// ================= REGISTER =================
async function register() {
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  try {
    const res = await fetch(BASE_URL + "/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    alert(data.message);
    window.location.href = "index.html";
  } catch (err) {
    alert("Registration failed ❌");
    console.log(err);
  }
}

// ================= TOKEN =================
const token = localStorage.getItem("token");

// ================= PROFILE =================
async function getProfile() {
  if (!token) return;

  try {
    const res = await fetch(BASE_URL + "/api/profile", {
      headers: { Authorization: "Bearer " + token },
    });

    const user = await res.json();

    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
      userInfo.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
      `;
    }
  } catch (err) {
    console.log(err);
  }
}

// ================= LOAD NOTES =================
async function loadNotes() {
  if (!token) return;

  try {
    const res = await fetch(BASE_URL + "/api/notes", {
      headers: { Authorization: "Bearer " + token },
    });

    const notes = await res.json();
    const list = document.getElementById("notesList");

    if (!list) return;

    list.innerHTML = "";

    notes.forEach((note) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${note.text}
        <button onclick="deleteNote('${note._id}')">X</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.log(err);
  }
}

// ================= ADD NOTE =================
async function addNote() {
  const text = document.getElementById("noteInput")?.value;

  if (!text) return alert("Enter note");

  try {
    await fetch(BASE_URL + "/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ text }),
    });

    document.getElementById("noteInput").value = "";
    loadNotes();
  } catch (err) {
    console.log(err);
  }
}

// ================= DELETE NOTE =================
async function deleteNote(id) {
  try {
    await fetch(BASE_URL + "/api/notes/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    loadNotes();
  } catch (err) {
    console.log(err);
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// ================= PAGE LOAD =================
if (window.location.pathname.includes("profile.html")) {
  if (!token) {
    window.location.href = "index.html";
  } else {
    getProfile();
    loadNotes();
  }
}

// ================= ANIMATION =================
// const card =
//   document.querySelector(".container") ||
//   document.querySelector(".profile-box");

// document.addEventListener("mousemove", (e) => {
//   if (!card) return;
//   const x = (window.innerWidth / 2 - e.pageX) / 25;
//   const y = (window.innerHeight / 2 - e.pageY) / 25;
//   card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
// });

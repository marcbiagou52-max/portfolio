/* ===== 1. Thème clair / sombre (mémorisé) ===== */
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-bs-theme", theme);
  themeBtn.innerHTML =
    theme === "dark"
      ? '<i class="bi bi-moon-stars-fill"></i>'
      : '<i class="bi bi-sun-fill"></i>';
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
applyTheme(savedTheme || "dark");

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

/* ===== 2. Texte animé (effet machine à écrire) ===== */
const phrases = [
  "web modernes.",
  "mobiles avec Flutter.",
  "de gestion avec Windows Forms.",
  "utiles et bien structurés.",
];
const typedEl = document.getElementById("typed");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];
  typedEl.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex++;
    setTimeout(typeLoop, 70);
  } else if (!deleting) {
    deleting = true;
    setTimeout(typeLoop, 1500);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 35);
  } else {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeLoop, 300);
  }
}
typeLoop();

/* ===== 3. Filtre des projets ===== */
const filterButtons = document.querySelectorAll("#filters button");
const projects = document.querySelectorAll("#projectGrid .project");
const projectSearch = document.getElementById("projectSearch");
let activeProjectFilter = "all";

function updateProjects() {
  const query = projectSearch.value.trim().toLocaleLowerCase();

  projects.forEach((project) => {
    const categories = project.dataset.category.split(" ");
    const matchesCategory =
      activeProjectFilter === "all" || categories.includes(activeProjectFilter);
    const matchesSearch = project.textContent.toLocaleLowerCase().includes(query);
    project.classList.toggle("is-hidden", !matchesCategory || !matchesSearch);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    activeProjectFilter = btn.dataset.filter;

    filterButtons.forEach((b) => {
      b.classList.remove("btn-accent");
      b.classList.add("btn-outline-secondary");
    });
    btn.classList.remove("btn-outline-secondary");
    btn.classList.add("btn-accent");
    updateProjects();
  });
});
projectSearch.addEventListener("input", updateProjects);

/* ===== 4. Formulaire de contact ===== */
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  statusEl.className = "ms-3";

  // Validation Bootstrap
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      statusEl.textContent = "Message envoyé, merci !";
      statusEl.classList.add("text-success");
      form.reset();
      form.classList.remove("was-validated");
    } else {
      throw new Error("Erreur serveur");
    }
  } catch (err) {
    statusEl.textContent = "Échec de l'envoi. Réessaie ou écris-moi par email.";
    statusEl.classList.add("text-danger");
  }
});

/* ===== 5. Bouton retour en haut ===== */
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  toTop.classList.toggle("show", window.scrollY > 400);
});
toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===== 6. Année du footer ===== */
document.getElementById("year").textContent = new Date().getFullYear();

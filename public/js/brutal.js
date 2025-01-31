const html = document.documentElement;
const body = document.body;
const modeToggle = document.getElementById("mode-toggle");

function setMode(mode) {
  if (mode === "dark") {
    html.classList.add("dark-mode");
    html.classList.remove("light-mode");
  } else {
    html.classList.add("light-mode");
    html.classList.remove("dark-mode");
  }
  localStorage.setItem("preferredMode", mode);
}

function loadSavedMode() {
  const savedMode = localStorage.getItem("preferredMode");
  if (savedMode) {
    setMode(savedMode);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setMode(prefersDark ? "dark" : "light");
  }
  html.style.visibility = '';
}

function applyInitialMode() {
  const savedMode = localStorage.getItem("preferredMode");
  if (savedMode === "dark" || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add("dark-mode");
  }
  html.style.visibility = 'hidden';
}

modeToggle.addEventListener("click", () => {
  setMode(html.classList.contains("dark-mode") ? "light" : "dark");
});

// Panggil applyInitialMode segera
applyInitialMode();

// Panggil loadSavedMode setelah DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSavedMode);
} else {
  loadSavedMode();
}

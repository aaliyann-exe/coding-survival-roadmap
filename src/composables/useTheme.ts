import { ref, readonly } from "vue";

const STORAGE_KEY = "theme";

const isDark = ref(false);
let initialised = false;

function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

function init() {
  if (initialised) return;
  initialised = true;

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  isDark.value = savedTheme === "dark" || (!savedTheme && prefersDark);
  apply(isDark.value);

  // Follow the system if the user has never made an explicit choice.
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      isDark.value = event.matches;
      apply(isDark.value);
    });
}

function toggleDarkMode() {
  isDark.value = !isDark.value;
  apply(isDark.value);
  localStorage.setItem(STORAGE_KEY, isDark.value ? "dark" : "light");
}

export function useTheme() {
  init();
  return { isDark: readonly(isDark), toggleDarkMode };
}

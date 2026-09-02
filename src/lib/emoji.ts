import twemoji from "@twemoji/api";

export function initTwemoji() {
  const app = document.getElementById("app");

  if (!app) return;

  let isParsing = false;

  const parse = () => {
    if (isParsing) return;

    isParsing = true;

    twemoji.parse(app, {
      folder: "svg",
      ext: ".svg",
      className: "emoji",
    });

    isParsing = false;
  };

  // Initial parse
  parse();

  // Automatically handle content Vue adds later
  const observer = new MutationObserver(() => {
    parse();
  });

  observer.observe(app, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

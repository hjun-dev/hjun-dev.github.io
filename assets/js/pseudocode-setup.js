window.MathJax = {
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
    processEnvironments: true,
  },
};

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    let codeElements = document.querySelectorAll("pre>code.language-pseudocode, .language-pseudocode code");

    codeElements.forEach((elem) => {
      const texData = elem.textContent;
      const preParent = elem.parentElement;
      const parent = preParent.parentElement;

      if (!parent) return;

      let pseudoCodeElement = document.createElement("pre");
      pseudoCodeElement.classList.add("pseudocode");
      const text = document.createTextNode(texData);
      pseudoCodeElement.appendChild(text);

      parent.appendChild(pseudoCodeElement);
      parent.removeChild(preParent);

      try {
          pseudocode.renderElement(pseudoCodeElement);
      } catch (e) {
          console.error("Pseudocode render error:", e);
      }
    });
  }
});
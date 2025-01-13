(function () {
  let observer;

  window.addEventListener("message", async (event) => {
    if (event.source !== window || !event.data) {
      return;
    }

    if (event.data.type === "toggleHighlight") {
      if (event.data.enabled) {
        localStorage.setItem("enabled-highlight", "true");
        highlightAllVueCode();
        observeDOMChanges();
      } else {
        localStorage.removeItem("enabled-highlight");
        observer?.disconnect();
        const { extensionId } = event.data;
        document
          .querySelectorAll('script[src*="' + extensionId + '"]')
          .forEach((element) => {
            element.remove();
          });
        document
          .querySelectorAll('link[href*="' + extensionId + '"]')
          .forEach((element) => {
            element.remove();
          });

        // find el class = "language-xml vue-code-highlighter"
        document
          .querySelectorAll(".language-xml.vue-code-highlighter")
          .forEach((element) => {
            element.classList.remove("language-xml");
            element.classList.remove("vue-code-highlighter");
            element.classList.add("language-vue");
          });
      }
    } else if (event.data.type === "checkAndHighlight") {
      if (localStorage.getItem("enabled-highlight")) {
        highlightAllVueCode();
        observeDOMChanges();
      }
    }
  });

  function highlightAllVueCode() {
    hljs.highlightAll();
    document.querySelectorAll(".language-vue").forEach((element) => {
      // Method 1: wrap element with pre
      // if parent element is not pre, wrap it with pre
      // if (element.parentElement.tagName !== "PRE") {
      //   const pre = document.createElement("pre");
      //   pre.appendChild(element.cloneNode(true));
      //   element.replaceWith(pre);
      //   hljs.highlightElement(pre);
      // }

      // Method 2: replace class to language-xml
      // replace class to language-xml
      element.classList.remove("language-vue");
      element.classList.add("language-xml");
      element.classList.add("vue-code-highlighter");
      hljs.highlightElement(element);
    });
  }

  function observeDOMChanges() {
    observer = new MutationObserver(() => {
      highlightAllVueCode();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();

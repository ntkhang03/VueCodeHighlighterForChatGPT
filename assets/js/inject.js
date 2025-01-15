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
    // find el class = "hljs language-vue"
    document.querySelectorAll(".hljs.language-vue").forEach((element) => {
      console.log("highlightAllVueCode", element);
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
      // remove dataset data-highlighted="yes"
      element.removeAttribute("data-highlighted");
      element.classList.add("vue-code-highlighter");
      hljs.highlightElement(element);
    });
  }

  function observeDOMChanges() {
    observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (!mutation.target.closest(".hljs.vue-code-highlighter")) {
          highlightAllVueCode();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();

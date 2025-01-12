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
      }
    } else if (event.data.type === "checkAndHighlight") {
      if (localStorage.getItem("enabled-highlight")) {
        console.log("checkAndHighlight");
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

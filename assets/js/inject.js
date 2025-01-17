(function () {
  let observer;
  let highlightingId = null;

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
        try {
          observer?.disconnect();
        } catch (e) {}
        removeHighlighting(event.data.extensionId);
      }
    } else if (event.data.type === "checkAndHighlight") {
      hljs.configure({ ignoreUnescapedHTML: true });

      if (localStorage.getItem("enabled-highlight")) {
        highlightAllVueCode();
        observeDOMChanges();
      }
    }
  });

  function highlightAllVueCode() {
    const currentHighlightingId = String(Date.now());
    highlightingId = currentHighlightingId;

    const elements = document.querySelectorAll(".hljs.language-vue");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (highlightingId !== currentHighlightingId) return;
      element.removeAttribute("data-highlighted"); // Đánh dấu chưa xử lý
      element.classList.add("vue-code-highlighter");
      // element.textContent = element.textContent;
      hljs.highlightElement(element);
    }
  }

  function observeDOMChanges() {
    if (observer) {
      try {
        observer.disconnect();
      } catch (e) {}
    }

    observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList" || mutation.type === "attributes") {
          mutation.target
            .querySelectorAll(".hljs.language-vue")
            .forEach(() => highlightAllVueCode());
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }

  function removeHighlighting(extensionId) {
    document
      .querySelectorAll(
        `script[src*="${extensionId}"], link[href*="${extensionId}"]`
      )
      .forEach((element) => element.remove());

    document
      .querySelectorAll(".language-xml.vue-code-highlighter")
      .forEach((element) => {
        element.classList.remove("language-xml", "vue-code-highlighter");
        element.classList.add("language-vue");
      });
  }
})();

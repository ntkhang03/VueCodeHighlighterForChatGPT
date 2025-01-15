chrome.storage.local.get("sites", (data) => {
  const sites = data.sites || [];
  if (sites.includes(window.location.hostname)) {
    injectHighlightJS();
  }
});

// get message from popup.js
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "toggleHighlight") {
    if (message.enabled) {
      await injectHighlightJS();
    }
    window.postMessage(
      {
        ...message,
        extensionId: chrome.runtime.id
      },
      "*"
    );
  }
});

async function injectHighlightJS() {
  await injectScript(chrome.runtime.getURL("assets/js/inject.js"));
  await injectScript(chrome.runtime.getURL("assets/css/default.min.css"));
  await injectScript(chrome.runtime.getURL("assets/js/highlight.min.js"));
  await injectScript(chrome.runtime.getURL("assets/js/vue.min.js"));
  window.postMessage({ type: "checkAndHighlight" }, "*");
}

async function injectScript(url) {
  const type = url.split(".").pop() === "css" ? "link" : "script";
  return new Promise((resolve, reject) => {
    const element = document.createElement(type);
    element.onload = resolve;
    element.onerror = reject;
    if (type === "link") {
      element.rel = "stylesheet";
      element.href = url;
    } else {
      element.src = url;
    }
    (document.head || document.documentElement).appendChild(element);
  });
}

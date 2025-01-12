chrome.storage.local.get("sites", (data) => {
  injectHighlightJS();
});

// get message from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggleHighlight") {
    window.postMessage(message, "*");
  }
});

async function injectHighlightJS() {
  await injectScript(chrome.runtime.getURL("assets/js/inject.js"));
  await injectScript(chrome.runtime.getURL("assets/css/default.min.css"));
  await injectScript(chrome.runtime.getURL("assets/js/highlight.min.js"));
  await injectScript(chrome.runtime.getURL("assets/js/xml.min.js"));
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

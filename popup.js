(async () => {
  const getSites = () =>
    new Promise((resolve) => chrome.storage.local.get("sites", resolve));
  const getCurrentSite = () =>
    new Promise((resolve) =>
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
        resolve(new URL(tabs[0].url).hostname)
      )
    );

  const btnToggle = document.getElementById("toggleButton");

  const { sites = [] } = await getSites();
  const currentSite = await getCurrentSite();
  const enabled = sites.includes(currentSite);
  btnToggle.checked = enabled;

  btnToggle.addEventListener("click", async () => {
    // disable click button
    btnToggle.disabled = true;

    const { sites = [] } = await getSites();
    const currentSite = await getCurrentSite();

    const newState = !sites.includes(currentSite);
    const newSites = newState
      ? [...sites, currentSite]
      : sites.filter((site) => site !== currentSite);

    // Lưu trạng thái mới và gửi message đến content script
    chrome.storage.local.set({ sites: newSites }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "toggleHighlight",
          enabled: newState
        });

        // enable click button
        btnToggle.disabled = false;
      });
    });
  });
})();

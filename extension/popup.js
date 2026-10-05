const button = document.getElementById("btn-collect");

button.addEventListener("click", () => {
    button.textContent = "Clicked";
});

async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

function parseAdId(urlString) {
    try {
        const url = new URL(urlString);
        return url.searchParams.get("id");
    } catch {
        return null;
    }
}

async function init() {
    const output = document.getElementById("ad-id");
    const tab = await getCurrentTab();
    if (!tab?.url) {
        output.textContent = "無法讀取此頁面";
        return;
    }
    const adId = parseAdId(tab.url);
    output.textContent = adId ?? "這不是單則廣告頁面";
}

init();

const button = document.getElementById("btn-collect");

function getSelectedText() {
    return window.getSelection().toString();
}

button.addEventListener("click", async () => {
    const textarea = document.getElementById("ad-copy");
    const tab = await getCurrentTab();

    try {
        const [injection] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: getSelectedText,
        });
        textarea.value = injection.result || "請先在網頁上反白要抓取的文字";
    } catch (error) {
        console.error(error);
        textarea.value = "此頁面無法抓取（例如 chrome:// 頁面）";
    }
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

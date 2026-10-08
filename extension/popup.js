import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

async function signIn(email, password) {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || "登入失敗");
    return data;
}

async function saveAd(session, ad) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ads`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${session.access_token}`,
            Prefer: "return=minimal",
        },
        body: JSON.stringify(ad),
    });

    if (response.status === 409) throw new Error("這則廣告已經存過了");
    if (response.status === 401) throw new Error("登入已過期，請重新登入");
    if (!response.ok) throw new Error(`儲存失敗（${response.status}）`);
}

document.getElementById("ad-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("save-status");
    status.textContent = "儲存中…";

    const { session } = await chrome.storage.local.get("session");

    const field = (id) => document.getElementById(id).value.trim();
    const sourceId = field("ad-id");
    const competitor = field("competitor");
    const headline = field("headline");
    const copy = field("ad-copy");
    const startedAt = field("started-at");

    const ad = {
        id: `meta-${sourceId}`,
        competitor,
        platform: "Meta",
        headline,
        copy,
        started_at: startedAt,
        source_id: sourceId,
        source_url: `https://www.facebook.com/ads/library/?id=${sourceId}`,
        image_url: null,
        angle: null,
        is_real: true,
    };

    try {
        await saveAd(session, ad);
        await chrome.storage.local.set({ lastCompetitor: competitor });
        status.textContent = "已儲存 ✅";
    } catch (error) {
        status.textContent = error.message;
    }
});

document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("login-status");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const session = await signIn(email, password);
        await chrome.storage.local.set({ session });
        render(session);
    } catch (error) {
        status.textContent = error.message;
    }
});

const button = document.getElementById("btn-collect");

// 這個函式在 Facebook 頁面裡執行
function getSelectionInfo() {
    const selection = window.getSelection();
    const text = selection.toString();
    if (!text) return { text: "", adId: null };

    // 正規表示式：找「資料庫編號：」或「Library ID:」後面的一串數字
    const idPattern = /(?:資料庫編號|Library ID)[:：]\s*(\d+)/;

    // anchorNode 是反白起點所在的節點（通常是文字節點），先拿到它的父元素
    let element = selection.anchorNode.parentElement;

    while (element) {
        const match = element.innerText.match(idPattern);
        if (match) {
            return { text, adId: match[1] }; // 提示：括號 ( ) 抓到的部分在第幾個？
        }
        element = element.parentElement; // 往上一層
    }

    return { text, adId: null }; // 一路找到頂都沒有
}

button.addEventListener("click", async () => {
    const textarea = document.getElementById("ad-copy");
    const status = document.getElementById("save-status");
    status.textContent = "";
    const tab = await getCurrentTab();

    try {
        const [injection] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: getSelectionInfo,
        });
        const { text, adId } = injection.result;

        if (text) {
            textarea.value = text;

            const headlineInput = document.getElementById("headline");
            if (!headlineInput.value) {
                const firstLine = text.split("\n")[0].trim();
                headlineInput.value = firstLine.slice(0, 80);
            }
        } else {
            status.textContent = "請先在網頁上反白要抓取的文字";
        }

        if (adId) document.getElementById("ad-id").value = adId;
    } catch (error) {
        console.warn(error);
        status.textContent = "此頁面無法抓取（例如 chrome:// 頁面）";
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
    const { session, lastCompetitor } = await chrome.storage.local.get([
        "session",
        "lastCompetitor",
    ]);
    render(session);
    const competitorInput = document.getElementById("competitor");
    competitorInput.value = lastCompetitor ?? "";
    const output = document.getElementById("ad-id");
    const tab = await getCurrentTab();
    if (!tab?.url) return;

    const adId = parseAdId(tab.url);
    output.value = adId ?? "";
}

init();

function render(session) {
    const loginForm = document.getElementById("login-form");
    const appPanel = document.getElementById("app-panel");

    if (session) {
        loginForm.hidden = true;
        appPanel.hidden = false;
        document.getElementById("user-email").textContent = session.user.email;
    } else {
        loginForm.hidden = false;
        appPanel.hidden = true;
    }
}

const btnLogOut = document.getElementById("btn-logout");
btnLogOut.addEventListener("click", async () => {
    await chrome.storage.local.remove("session");
    render(null);
});

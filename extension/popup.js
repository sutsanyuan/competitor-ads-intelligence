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
        console.warn(error);
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
    const { session } = await chrome.storage.local.get("session");
    render(session);
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

import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

let capturedImage = null;

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
async function refreshSession(refreshToken) {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error("登入已過期，請重新登入");
    return data; // 新的 session，格式跟登入時拿到的一樣
}
async function getValidSession() {
    const { session } = await chrome.storage.local.get("session");
    if (!session) throw new Error("請先登入");

    // expires_at 的單位是「秒」，Date.now() 的單位是「毫秒」
    const expiresAtMs = session.expires_at * 1000;
    const isExpiringSoon = expiresAtMs - Date.now() < 60 * 1000; // 剩不到 60 秒

    if (!isExpiringSoon) return session;

    const newSession = await refreshSession(session.refresh_token);
    await chrome.storage.local.set({ session: newSession });
    return newSession;
}

async function saveAd(session, ad) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ads`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${session.access_token}`,
            Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(ad),
    });

    if (response.status === 401) throw new Error("登入已過期，請重新登入");
    if (!response.ok) throw new Error(`儲存失敗（${response.status}）`);
}

async function uploadImage(session, path, blob) {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/ad-images/${path}`, {
        method: "POST",
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "image/webp",
            "x-upsert": "true", // 同名檔案存在時覆蓋
        },
        body: blob, // 提示：直接把圖片本身當作 body，不用 JSON.stringify
    });
    if (!response.ok) throw new Error(`圖片上傳失敗（${response.status}）`);

    // 回傳公開網址（注意路徑多了 /public/）
    return `${SUPABASE_URL}/storage/v1/object/public/ad-images/${path}`;
}

document.getElementById("ad-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("save-status");
    status.textContent = "儲存中…";

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
        is_real: true,
    };

    try {
        const session = await getValidSession();
        if (capturedImage) {
            status.textContent = "上傳圖片中…";
            ad.image_url = await uploadImage(session, `meta/${sourceId}.webp`, capturedImage);
        }

        status.textContent = "儲存中…";

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
            const rect = element.getBoundingClientRect();
            return {
                text,
                adId: match[1],
                rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                dpr: window.devicePixelRatio,
            }; // 提示：括號 ( ) 抓到的部分在第幾個？
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
        const { text, adId, rect, dpr } = injection.result;

        if (rect) {
            capturedImage = await captureCard(rect, dpr);

            const preview = document.getElementById("ad-preview");
            preview.src = URL.createObjectURL(capturedImage);
            preview.hidden = false;
        }

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

async function captureCard(rect, dpr) {
    // 1. 截圖
    const dataUrl = await chrome.tabs.captureVisibleTab({ format: "png" });
    const blob = await (await fetch(dataUrl)).blob();
    const shot = await createImageBitmap(blob);

    // 2. 把 CSS 像素換算成截圖的實體像素，並夾在截圖範圍內
    const sx = Math.max(0, Math.round(rect.x * dpr));
    const sy = Math.max(0, Math.round(rect.y * dpr));
    const sw = Math.min(shot.width - sx, Math.round(rect.width * dpr));
    const sh = Math.min(shot.height - sy, Math.round(rect.height * dpr));

    // 3. 計算縮放：寬度最多 800px，比較小的圖不放大
    const scale = Math.min(1, 800 / sw);
    const canvas = new OffscreenCanvas(Math.round(sw * scale), Math.round(sh * scale));

    // 4. 裁切並縮放
    canvas.getContext("2d").drawImage(shot, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    // 5. 壓縮成 WebP
    return canvas.convertToBlob({ type: "image/webp", quality: 0.8 });
}

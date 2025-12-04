import type { JitsiApi } from "./CoWebsite/JitsiCoWebsite";

let api: JitsiApi | undefined;

export function setJitsiApi(a: JitsiApi | undefined) {
    api = a;
}

export function sendJitsiChatMessage(text: string) {
    try {
        if (api && text && text.trim().length > 0) {
            // Jitsi external API command to send a chat message in the current meeting
            api.executeCommand("sendChatMessage", text);
        }
    } catch (e) {
        // Fail silently in case chat is disabled or API changes
        // eslint-disable-next-line no-console
        console.warn("[JitsiChatBridge] sendChatMessage failed", e);
    }
}



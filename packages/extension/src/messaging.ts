import { AnalyticsEvent } from "./analytics";

export enum MessageType {
    LOG_EVENT = "LOG_EVENT",
    POPUP_OPEN = "POPUP_OPEN",
    POPUP_CLOSED = "POPUP_CLOSED",
    LINKS_GATHERED = "LINKS_GATHERED",
    SHOW_STARS = "SHOW_STARS",
}

export type Message =
    | { type: MessageType.POPUP_OPEN }
    | { type: MessageType.POPUP_CLOSED }
    | { type: MessageType.SHOW_STARS }
    | { type: MessageType.LINKS_GATHERED; linksCount: number }
    | { type: MessageType.LOG_EVENT; event: AnalyticsEvent };

export function sendMessage(msg: Message) {
    chrome.runtime.sendMessage(msg);
}

export function onMessage(cb: (msg: Message) => void) {
    chrome.runtime.onMessage.addListener((msg: Message) => {
        cb(msg);
    });
}

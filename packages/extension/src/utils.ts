export enum MessageType {
    POPUP_OPEN = "POPUP_OPEN",
    POPUP_CLOSED = "POPUP_CLOSED",
    LINKS_GATHERED = "LINKS_GATHERED",
    SHOW_STARS = "SHOW_STARS",
}

export const LINK_CLASS = "star-spy-link";
export const POINTER_CLASS = "star-spy-pointer";
export const TOKEN_KEY = "_starSpyKey";

export type Message =
    | { type: MessageType.POPUP_OPEN }
    | { type: MessageType.POPUP_CLOSED }
    | { type: MessageType.LINKS_GATHERED; linksCount: number }
    | { type: MessageType.SHOW_STARS };

export function sendMessage(msg: Message) {
    chrome.runtime.sendMessage(msg);
}

export function onMessage(cb: (msg: Message) => void) {
    chrome.runtime.onMessage.addListener((msg: Message) => {
        cb(msg);
    });
}

export function uniqueLinks(links: HTMLAnchorElement[]) {
    const hash: Record<string, HTMLAnchorElement> = {};
    links.forEach((a) => {
        const [cleanHref] = a.href.split("#");
        hash[cleanHref] = a;
    });
    return Object.values(hash);
}

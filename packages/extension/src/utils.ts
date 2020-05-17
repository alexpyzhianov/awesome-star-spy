export const LINK_CLASS = "star-spy-link";
export const BODY_DONE_CLASS = "star-spy-body-done";
export const POINTER_CLASS = "star-spy-pointer";
export const TOKEN_KEY = "_starSpyKey";
export const OPT_OUT_ANALYTICS = "starSpyOptOutAnalytics";

export function formatStarCount(num: number) {
    let [int] = num.toString().split(".");
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return int;
}

export function getUniqueLinks(links: HTMLAnchorElement[]) {
    const unique = {} as Record<string, HTMLAnchorElement>;
    links.forEach((a) => {
        const [url, hash] = a.href.split("#");
        unique[url] = a;
    });
    return Object.values(unique);
}

export const LINK_CLASS = "star-spy-link";
export const POINTER_CLASS = "star-spy-pointer";
export const TOKEN_KEY = "_starSpyKey";

export function formatStarCount(num: number) {
    let [int] = num.toString().split(".");
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return int;
}

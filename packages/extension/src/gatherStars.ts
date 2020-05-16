import { POINTER_CLASS, LINK_CLASS } from "./utils";
import { sendMessage, MessageType } from "./messaging";

const allLinks: HTMLAnchorElement[] = Array.prototype.slice.call(
    document.querySelectorAll("a"),
);

const repoLinks = allLinks.filter(({ href }) => {
    const [, , gh, author, repo, more] = href.split("/");
    return (
        gh === "github.com" &&
        Boolean(author) &&
        author !== "topics" &&
        Boolean(repo) &&
        !more
    );
});

repoLinks.forEach((link) => {
    if (link.classList.contains(LINK_CLASS)) {
        return;
    }

    const point = document.createElement("span");
    point.classList.add(POINTER_CLASS);
    point.innerText = " ️🎯";

    link.appendChild(point);
    link.classList.add(LINK_CLASS);
});

sendMessage({
    type: MessageType.LINKS_GATHERED,
    linksCount: repoLinks.length,
});

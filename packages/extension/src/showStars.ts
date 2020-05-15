import { POINTER_CLASS, LINK_CLASS, TOKEN_KEY } from "./utils";

const links = Array.prototype.slice.call(
    document.getElementsByClassName(LINK_CLASS),
) as HTMLAnchorElement[];

const pointers = Array.prototype.slice.call(
    document.getElementsByClassName(POINTER_CLASS),
) as HTMLSpanElement[];

pointers.forEach((pointer) => pointer.remove());

function getStarEmojis(stars: number) {
    let emojis = "";
    while ((stars /= 10) > 1) {
        emojis += "⭐️";
    }
    return emojis;
}

links.forEach((link) => {
    const [, , , org, repo] = link.href.split("/");
    if (!org || !repo) return;

    const star = document.createElement("span");
    star.innerText = ` ⭐️(...loading)`;
    link.appendChild(star);

    fetch(`https://api.github.com/repos/${org}/${repo}`, {
        headers: {
            Authorization: `token ${window[TOKEN_KEY as any]}`,
        },
    })
        .then((resp) => resp.json())
        .then((body) => {
            const starCount = body?.stargazers_count;

            if (typeof starCount === "number") {
                star.innerText = ` ️${getStarEmojis(starCount)} – ${starCount}`;
            } else {
                star.innerText = " 🚛 (repo was moved)";
            }

            star.style.fontSize = "inherit";
        });
});

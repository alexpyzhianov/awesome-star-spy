import formatRelative from "date-fns/formatRelative";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { POINTER_CLASS, LINK_CLASS, TOKEN_KEY } from "./utils";
import { sendMessage, MessageType } from "./messaging";
import { AnalyticsEventType } from "./analytics";

const now = new Date();

const links = Array.prototype.slice.call(
    document.getElementsByClassName(LINK_CLASS),
) as HTMLAnchorElement[];

const pointers = Array.prototype.slice.call(
    document.getElementsByClassName(POINTER_CLASS),
) as HTMLSpanElement[];

pointers.forEach((pointer) => pointer.remove());

function getStarEmojis(count: number) {
    if (count < 10) {
        return "🥔";
    }

    let stars = "";

    while ((count /= 10) > 1) {
        stars += "⭐️";
    }

    return stars;
}

function getFreshEmoji(date: Date) {
    const diff = differenceInCalendarDays(now, date);

    if (diff < 10) {
        return "🔥";
    } else if (diff < 60) {
        return "☀️";
    } else if (diff < 120) {
        return "️⛅️";
    } else if (diff < 180) {
        return "☁️";
    } else if (diff < 360) {
        return "🌧";
    } else {
        return "❄️";
    }
}

function fetchRepoData(url: string): Promise<Record<string, any>> {
    return fetch(url, {
        headers: {
            Authorization: `token ${window[TOKEN_KEY as any]}`,
        },
    }).then((resp) => resp.json());
}

function getLabel(stars: number, pushedAt?: Date, lang?: string) {
    let output = ` ${getStarEmojis(stars)} ${stars ?? "?"}`;

    if (pushedAt) {
        output += ` ${getFreshEmoji(pushedAt)} ${formatRelative(
            pushedAt,
            now,
        )}`;
    }

    if (lang) {
        output += ` ✏️ ${lang}`;
    }

    return output;
}

links.forEach((link) => {
    const [, , , org, repo] = link.href.split("/");
    if (!org || !repo) return;

    const star = document.createElement("span");
    star.innerText = ` ⭐️(...loading)`;
    link.appendChild(star);

    fetchRepoData(`https://api.github.com/repos/${org}/${repo}`).then(
        (body) => {
            const starCount = body?.stargazers_count;
            const pushedAt = body?.pushed_at
                ? new Date(body.pushed_at)
                : undefined;
            const lang = body?.language;

            const movedUrl = body?.url;

            if (typeof starCount === "number") {
                star.innerText = getLabel(starCount, pushedAt, lang);
            } else if (movedUrl) {
                star.innerText = ` 🚛 ${movedUrl}`;
            } else {
                star.innerText = " 😕 not found";
            }

            star.style.fontSize = "inherit";
            star.addEventListener("click", () => {
                sendMessage({
                    type: MessageType.LOG_EVENT,
                    event: {
                        type: AnalyticsEventType.LINK_FOLLOW,
                        data: { starCount, lang, pushedAt },
                    },
                });
            });
        },
    );
});

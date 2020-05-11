declare var githubToken: string;

const linkRegex = /https:\/\/github\.com\/[-\.\w\d]+\/[-\.\w\d]+$/; // https://github.com/<org>/<repo>

const links: HTMLAnchorElement[] = Array.prototype.slice.call(
    document.querySelectorAll("a"),
);

const githubLinks = links.filter(({ href }) => linkRegex.test(href));

githubLinks.forEach((link) => {
    const [, , , org, repo] = link.href.split("/");

    if (org === "topics") return;

    if (org && repo) {
        fetch(`https://api.github.com/repos/${org}/${repo}`, {
            headers: {
                Authorization: `token ${githubToken}`,
            },
        })
            .then((resp) => resp.json())
            .then((body) => {
                const star = document.createElement("span");
                star.innerText = ` ⭐️(${body ? body.stargazers_count : "?"})`;
                link.appendChild(star);
            });
    }
});

console.log(
    "Getting stars for urls:",
    githubLinks.map(({ href }) => href),
);

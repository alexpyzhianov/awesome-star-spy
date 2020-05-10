import { parse } from "qs";

const clientId = "";
const clientSecret = "";

let token = "";

function auth() {
    chrome.identity.launchWebAuthFlow(
        {
            url: `https://github.com/login/oauth/authorize?client_id=${clientId}`,
            interactive: true,
        },
        function (redirectUrl) {
            if (redirectUrl) {
                const { code } = parse(redirectUrl.split("?")[1]);
                console.log({ code });
                fetch(
                    `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
                    { method: "POST" },
                )
                    .then((resp) => resp.text())
                    .then(parse)
                    .then((results) => {
                        console.log(results);
                        token = results && (results.access_token as string);
                    })
                    .catch(console.error);
            } else {
                console.log("failed");
            }

            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            }
        },
    );
}

chrome.browserAction.onClicked.addListener(function (tab) {
    if (!token) {
        auth();
    } else {
        console.log(token);
        chrome.tabs.executeScript(
            tab.id,
            { code: `var githubToken = "${token}"` },
            () => {
                chrome.tabs.executeScript(tab.id, {
                    file: "js/content.js",
                });
            },
        );
    }
});

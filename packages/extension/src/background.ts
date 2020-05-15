import qs from "qs";
import { MessageType, TOKEN_KEY } from "./utils";

const STATE = `${Math.random().toString()}-${Date.now().toString()}-${Math.random().toString()}`;
const API_ENDPOINT = "https://starspy.alexpyzhianov.com";

function onLogin(redirectUrl?: string) {
    if (!redirectUrl) {
        return console.error("Failed to login");
    }

    console.log("Received non-empty redirect url");

    const [, urlQuery] = redirectUrl.split("?");
    const { code, state } = qs.parse(urlQuery);

    if (state !== STATE) {
        return console.error("States do not match");
    }

    const tokenEndpoint = API_ENDPOINT + "/token";

    fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
    })
        .then((resp) => resp.json())
        .then((body) => {
            console.log(body);
            const token = body && body.access_token;

            if (!token) {
                console.error("No access token inside body");
                return;
            }

            chrome.tabs.executeScript(
                { code: `window.${TOKEN_KEY} = "${token}"` },
                () => {
                    chrome.tabs.executeScript({
                        file: "js/showStars.js",
                    });
                },
            );
        });
}

function fetchClientId() {
    const clientIdEndpoint = API_ENDPOINT + "/client_id";

    return fetch(clientIdEndpoint)
        .then((response) => response.json())
        .then((body) => {
            const clientId = body && body.client_id;
            if (!clientId) {
                return console.error("No client_id in response");
            }

            return clientId;
        });
}

function launchWebAuthFlow(clientId: string) {
    const query = qs.stringify({
        client_id: clientId,
        state: STATE,
    });

    const authUrl = `https://github.com/login/oauth/authorize?${query}`;

    chrome.identity.launchWebAuthFlow(
        { url: authUrl, interactive: true },
        onLogin,
    );
}

chrome.runtime.onConnect.addListener((port) => {
    chrome.tabs.executeScript({
        file: "js/gatherStars.js",
    });

    port.onDisconnect.addListener(() => {
        // return chrome.tabs.executeScript({
        //     file: "js/cleanUp.js",
        // });
    });
});

chrome.runtime.onMessage.addListener(({ type }) => {
    switch (type) {
        case MessageType.SHOW_STARS:
            return fetchClientId().then(launchWebAuthFlow);
        default:
            return;
    }
});

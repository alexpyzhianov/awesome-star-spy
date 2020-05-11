import qs from "qs";
import { MessageType } from "./config";

const TOKEN_KEY = "ghToken";
const API_ENDPOINT = process.env.PRODUCTION
    ? "http://starspy.alexpyzhianov.com:8080"
    : "http://localhost:8080";

const STATE = `${Math.random().toString()}-${Date.now().toString()}-${Math.random().toString()}`;

function onLogin(redirectUrl?: string) {
    console.log("Received redirect url", redirectUrl);

    if (!redirectUrl) {
        return console.error("Failed to login");
    }

    const [, urlQuery] = redirectUrl.split("?");
    const { code, state } = qs.parse(urlQuery);

    console.log({ code, state });

    if (state !== STATE) {
        return console.error("States do not match");
    }

    const tokenEndpoint = API_ENDPOINT + "/token";
    console.log("Using access_token endpoint", tokenEndpoint);

    fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
    })
        .then((resp) => resp.json())
        .then((body) => {
            const token = body && body.access_token;
            if (token) {
                console.log("Login successful");
                chrome.storage.local.set({ [TOKEN_KEY]: token });
            } else {
                console.warn("No access_token inside body");
                console.log(body);
            }
        })
        .catch(console.error);
}

function signIn() {
    const clientIdEndpoint = API_ENDPOINT + "/client_id";
    console.log("Using client_id endpoint", clientIdEndpoint);

    fetch(clientIdEndpoint)
        .then((response) => response.json())
        .then((body) => {
            const clientId = body && body.client_id;
            if (!clientId) {
                return console.warn("No client_id in response");
            }

            console.log("Received clientId", clientId);
            console.log("Using state", STATE);

            const query = qs.stringify({
                client_id: clientId,
                state: STATE,
            });

            const authUrl = `https://github.com/login/oauth/authorize?${query}`;

            chrome.identity.launchWebAuthFlow(
                { url: authUrl, interactive: true },
                onLogin,
            );
        });
}

function signOut() {
    console.warn("Not implemented");
}

function displayStars() {
    chrome.storage.local.get((items) => {
        if (!items[TOKEN_KEY]) {
            console.warn("Please authorize with GitHub to display stars");
        }

        chrome.tabs.executeScript(
            { code: `var githubToken = "${items[TOKEN_KEY]}"` },
            () => {
                chrome.tabs.executeScript({
                    file: "js/content.js",
                });
            },
        );
    });
}

chrome.runtime.onMessage.addListener(({ type }) => {
    switch (type) {
        case MessageType.INIT:
            return console.log("Awesome Star Spy init successful");
        case MessageType.SIGN_IN:
            return signIn();
        case MessageType.SIGN_OUT:
            return signOut();
        case MessageType.DISPLAY_STARS:
            return displayStars();
        default:
            console.warn("Unknown message " + type);
            return;
    }
});

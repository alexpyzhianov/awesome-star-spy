import qs from "qs";
import {
    initAnalytics,
    logEvent,
    AnalyticsEventType,
    optOutAnalytics,
} from "./analytics";
import { MessageType, Message } from "./messaging";
import { TOKEN_KEY, OPT_OUT_ANALYTICS } from "./utils";

const STATE = `${Math.random().toString()}-${Date.now().toString()}-${Math.random().toString()}`;
const API_ENDPOINT = "https://starspy.alexpyzhianov.com";

async function onLogin(redirectUrl?: string) {
    logEvent({
        type: AnalyticsEventType.REDIRECT_STEP,
        data: { success: Boolean(redirectUrl) },
    });

    if (!redirectUrl) {
        return console.error("Failed to login");
    }

    const [, urlQuery] = redirectUrl.split("?");
    const { code, state } = qs.parse(urlQuery);

    if (state !== STATE) {
        return console.error("States do not match");
    }

    const tokenEndpoint = API_ENDPOINT + "/token";

    const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
    }).then((resp) => resp.json());

    const token = response && response.access_token;

    logEvent({
        type: AnalyticsEventType.TOKEN_STEP,
        data: { success: Boolean(token) },
    });

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
}

async function fetchClientId() {
    const clientIdEndpoint = API_ENDPOINT + "/client_id";

    const response = await fetch(clientIdEndpoint).then((response) =>
        response.json(),
    );

    const clientId = response && response.client_id;

    logEvent({
        type: AnalyticsEventType.CLIENT_ID_STEP,
        data: { success: Boolean(clientId) },
    });

    if (!clientId) {
        return console.error("No client_id in response");
    }

    return clientId;
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

function onOptOutAnalytics(optOut: boolean) {
    logEvent({ type: AnalyticsEventType.OPT_OUT, data: { optOut } });
    optOutAnalytics(optOut);
    if (optOut) {
        chrome.storage.local.set({ [OPT_OUT_ANALYTICS]: true });
    } else {
        chrome.storage.local.remove(OPT_OUT_ANALYTICS);
    }
}

chrome.storage.local.get((items) => {
    if (!items[OPT_OUT_ANALYTICS]) {
        initAnalytics();
    }
});

chrome.runtime.onConnect.addListener((port) => {
    chrome.tabs.executeScript({
        file: "js/gatherStars.js",
    });

    port.onDisconnect.addListener(() => {
        logEvent({ type: AnalyticsEventType.POPUP_CONNECTION_LOST });
        // return chrome.tabs.executeScript({
        //     file: "js/cleanUp.js",
        // });
    });
});

chrome.runtime.onMessage.addListener((msg: Message) => {
    switch (msg.type) {
        case MessageType.SHOW_STARS:
            return fetchClientId().then(launchWebAuthFlow);
        case MessageType.LOG_EVENT:
            return logEvent(msg.event);
        case MessageType.OPT_OUT_ANALYTICS:
            return onOptOutAnalytics(msg.optOut);
        default:
            return;
    }
});

import React, { useEffect } from "react";
import { MessageType, TOKEN_KEY } from "../config";
import "./Popup.css";

function send(type: MessageType) {
    chrome.runtime.sendMessage({ type });
}

export default function Popup() {
    const [tabId, setTabId] = React.useState<number>();
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [starSpyActive, setStarSpyActive] = React.useState(false);

    useEffect(() => {
        send(MessageType.INIT);

        chrome.runtime.onMessage.addListener(({ type }) => {
            switch (type) {
                case MessageType.SIGN_OUT_SUCCESS:
                    return setIsLoggedIn(false);
                case MessageType.SIGN_IN_SUCCESS:
                    return setIsLoggedIn(true);
                default:
                    return;
            }
        });
    }, []);

    useEffect(() => {
        chrome.storage.local.get((storage) => {
            setIsLoggedIn(Boolean(storage[TOKEN_KEY]));
        });
    });

    return (
        <div className="container">
            {isLoggedIn && (
                <button
                    className="button"
                    onClick={() => {
                        send(MessageType.DISPLAY_STARS);
                        setStarSpyActive(true);
                    }}
                    disabled={starSpyActive}
                >
                    Show Stars
                </button>
            )}

            {isLoggedIn ? (
                <button
                    className="button outline"
                    onClick={() => send(MessageType.SIGN_OUT)}
                >
                    Sign Out
                </button>
            ) : (
                <button
                    className="button"
                    onClick={() => send(MessageType.SIGN_IN)}
                >
                    Sign In
                </button>
            )}
        </div>
    );
}

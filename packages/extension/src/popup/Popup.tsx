import React, { useEffect } from "react";
import { MessageType, TOKEN_KEY } from "../config";
import "./Popup.css";

function send(type: MessageType) {
    chrome.runtime.sendMessage({ type });
}

export default function Popup() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

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
        <div className="popupContainer">
            {isLoggedIn ? (
                <button onClick={() => send(MessageType.SIGN_OUT)}>
                    Sign Out
                </button>
            ) : (
                <button onClick={() => send(MessageType.SIGN_IN)}>
                    Sign In
                </button>
            )}

            <button onClick={() => send(MessageType.DISPLAY_STARS)}>
                Display Stars
            </button>
        </div>
    );
}

import React, { useEffect } from "react";
import { MessageType } from "../config";
import "./Popup.css";

function send(type: MessageType) {
    chrome.runtime.sendMessage({ type });
}

export default function Popup() {
    useEffect(() => send(MessageType.INIT), []);

    return (
        <div className="popupContainer">
            <button onClick={() => send(MessageType.SIGN_IN)}>Sign In</button>
            <button onClick={() => send(MessageType.SIGN_OUT)}>Sign Out</button>
            <button onClick={() => send(MessageType.DISPLAY_STARS)}>
                Display Stars
            </button>
        </div>
    );
}

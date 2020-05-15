import React, { useEffect } from "react";
import { MessageType, sendMessage, onMessage } from "../utils";
import "./Popup.css";

export default function Popup() {
    const [linksFound, setLinksFound] = React.useState<number>();

    useEffect(() => {
        chrome.runtime.connect();
        onMessage((msg) => {
            if (msg.type === MessageType.LINKS_GATHERED) {
                setLinksFound(msg.linksCount);
            }
        });
    }, []);

    return (
        <div className="container">
            <p>
                Links found: <strong>{linksFound ?? "?"}</strong>
            </p>
            <button
                className="button"
                onClick={() => sendMessage({ type: MessageType.SHOW_STARS })}
            >
                Show Stars
            </button>
        </div>
    );
}

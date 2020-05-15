import React, { useEffect } from "react";
import { MessageType, sendMessage, onMessage } from "../utils";
import "./Popup.css";

export default function Popup() {
    const [linksFound, setLinksFound] = React.useState<number>();
    const [clicked, setClicked] = React.useState(false);

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
                GitHub links found: <strong>{linksFound ?? "?"}</strong>
            </p>
            <button
                className="button"
                onClick={() => {
                    sendMessage({ type: MessageType.SHOW_STARS });
                    setClicked(true);
                }}
                disabled={clicked}
            >
                Show Stars
            </button>
        </div>
    );
}

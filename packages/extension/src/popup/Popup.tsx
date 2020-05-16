import React, { useEffect } from "react";
import { MessageType, sendMessage, onMessage } from "../messaging";
import { AnalyticsEventType } from "../analytics";
import "./Popup.css";

export default function Popup() {
    const [linksFound, setLinksFound] = React.useState<number>();
    const [clicked, setClicked] = React.useState(false);

    useEffect(() => {
        sendMessage({
            type: MessageType.LOG_EVENT,
            event: { type: AnalyticsEventType.POPUP_OPEN },
        });

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
                GitHub&nbsp;urls&nbsp;found:&nbsp;
                <strong>{linksFound ?? "?"}</strong>
            </p>
            <button
                className="button"
                onClick={() => {
                    sendMessage({ type: MessageType.SHOW_STARS });
                    sendMessage({
                        type: MessageType.LOG_EVENT,
                        event: {
                            type: AnalyticsEventType.SHOW_STARS_CLICK,
                            data: { urlsCount: linksFound },
                        },
                    });
                    setClicked(true);
                }}
                disabled={clicked}
            >
                Show stars
            </button>
        </div>
    );
}

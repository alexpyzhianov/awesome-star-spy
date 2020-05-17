import React from "react";
import { MessageType, sendMessage, onMessage } from "../messaging";
import { AnalyticsEventType } from "../analytics";
import { OPT_OUT_ANALYTICS } from "../utils";
import "./Popup.css";

export default function Popup() {
    const [linksFound, setLinksFound] = React.useState<number>();
    const [clicked, setClicked] = React.useState(false);
    const [optOutAnalytics, setOptOutAnalytics] = React.useState(false);

    React.useEffect(() => {
        sendMessage({
            type: MessageType.LOG_EVENT,
            event: { type: AnalyticsEventType.POPUP_OPEN },
        });

        chrome.runtime.connect();

        chrome.storage.local.get((items) => {
            if (items[OPT_OUT_ANALYTICS]) {
                setOptOutAnalytics(true);
            }
        });

        onMessage((msg) => {
            if (msg.type === MessageType.LINKS_GATHERED) {
                setLinksFound(msg.linksCount);
            }
        });
    }, []);

    return (
        <div className="popup">
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

            <label className="optOut">
                <input
                    className="optOut-checkbox"
                    type="checkbox"
                    checked={!optOutAnalytics}
                    onChange={(e) => {
                        const optOut = !e.target.checked;
                        setOptOutAnalytics(optOut);
                        sendMessage({
                            type: MessageType.OPT_OUT_ANALYTICS,
                            optOut,
                        });
                    }}
                />
                <span>
                    Allow the&nbsp;collection of&nbsp;anonymized data
                    to&nbsp;help improve this&nbsp;plugin
                </span>
            </label>
        </div>
    );
}

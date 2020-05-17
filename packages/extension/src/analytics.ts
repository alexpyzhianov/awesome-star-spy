import { getInstance } from "amplitude-js";

const analyticsClient = getInstance();

export enum AnalyticsEventType {
    POPUP_OPEN = "POPUP_OPEN",
    POPUP_CONNECTION_LOST = "POPUP_CONNECTION_LOST",
    CLIENT_ID_STEP = "CLIENT_ID_STEP",
    TOKEN_STEP = "TOKEN_STEP",
    REDIRECT_STEP = "REDIRECT_STEP",
    OPT_OUT = "OPT_OUT",
    SHOW_STARS_CLICK = "SHOW_STARS_CLICK",
    LINK_FOLLOW = "LINK_FOLLOW",
}

export type AnalyticsEvent =
    | { type: AnalyticsEventType.POPUP_OPEN }
    | { type: AnalyticsEventType.POPUP_CONNECTION_LOST }
    | { type: AnalyticsEventType.CLIENT_ID_STEP; data: { success: boolean } }
    | { type: AnalyticsEventType.REDIRECT_STEP; data: { success: boolean } }
    | { type: AnalyticsEventType.TOKEN_STEP; data: { success: boolean } }
    | { type: AnalyticsEventType.OPT_OUT; data: { optOut: boolean } }
    | {
          type: AnalyticsEventType.SHOW_STARS_CLICK;
          data: { urlsCount?: number };
      }
    | {
          type: AnalyticsEventType.LINK_FOLLOW;
          data: { starCount: number; lang?: string; daysSinceUpdate?: number };
      };

export function initAnalytics() {
    analyticsClient.init("2a473fe514ca9a921b3eb3f2bc943261");
}

export function logEvent(event: AnalyticsEvent) {
    if ("data" in event) {
        analyticsClient.logEvent(event.type, event.data);
    } else {
        analyticsClient.logEvent(event.type);
    }
}

export function optOutAnalytics(optOut: boolean) {
    analyticsClient.setOptOut(optOut);
}

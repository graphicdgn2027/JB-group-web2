import { createContext, useContext } from "react";

export interface ReviewQueue {
  /** Submissions awaiting review (reviewers only; 0 otherwise). */
  pending: number;
  refresh: () => void;
  /** Unread contact-form messages (inbox managers only; 0 otherwise). */
  unreadMessages: number;
  refreshInbox: () => void;
}

export const ReviewQueueContext = createContext<ReviewQueue>({
  pending: 0,
  refresh: () => undefined,
  unreadMessages: 0,
  refreshInbox: () => undefined,
});

export function useReviewQueue(): ReviewQueue {
  return useContext(ReviewQueueContext);
}

import { createContext, useContext } from "react";

export interface ReviewQueue {
  /** Submissions awaiting review (reviewers only; 0 otherwise). */
  pending: number;
  refresh: () => void;
}

export const ReviewQueueContext = createContext<ReviewQueue>({ pending: 0, refresh: () => undefined });

export function useReviewQueue(): ReviewQueue {
  return useContext(ReviewQueueContext);
}

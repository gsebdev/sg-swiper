export interface SwipeSession {
  active: boolean;
  type: "mouse" | "touch";
  startX: number;
  startTime: number;
  velocity: number;
  isClick: boolean;
  deltaX: number;
  lastEvent: Event | null;
  lastEventDeltaX: number;
  lastEventVelocity: number;
  direction: -1 | 1 | 0;
}

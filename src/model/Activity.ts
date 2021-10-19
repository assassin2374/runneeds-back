export type Activity = {
  id?: number;
  startTime: Date | null;
  goalTime: Date | null;
  distance: number;
  userId: string;
};

export type ActivityTable = {
  id?: number;
  start_time: Date | null;
  goal_time: Date | null;
  distance: number;
  user_id: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function validActivity(object: Object): boolean {
  const activity = object as Activity;
  if (
    !activity.startTime ||
    !activity.goalTime ||
    !activity.distance ||
    !activity.userId
  ) {
    return false;
  }
  return true;
}

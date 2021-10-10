export type Activity = {
  id?: number;
  time: Date | null;
  distance: string;
  userId: string;
};

export type ActivityTable = {
  id?: number;
  time: Date | null;
  distance: string;
  user_id: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function validActivity(object: Object): boolean {
  const activity = object as Activity;
  if (!activity.time || !activity.distance || !activity.userId) {
    return false;
  }
  return true;
}

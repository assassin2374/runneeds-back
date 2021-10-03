export type Rundata = {
  id?: number;
  time: Date | null;
  distance: string;
  userId: string;
};

export type RundataTable = {
  id?: number;
  time: Date | null;
  distance: string;
  user_id: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function validRundata(object: Object): boolean {
  const rundata = object as Rundata;
  if (!rundata.time || !rundata.distance || !rundata.userId) {
    return false;
  }
  return true;
}

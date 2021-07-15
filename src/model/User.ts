export type User = {
  id?: number;
  name: string;
  email: string;
  pass: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function validUser(object: Object): boolean {
  const user = object as User;
  if (!user.name || !user.email || !user.pass) {
    return false;
  }
  return true;
}

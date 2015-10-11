export function isAuthenticated ( auth = new Map() ) {
  return (auth.get('jwt') !== undefined);
}

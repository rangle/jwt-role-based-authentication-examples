import { AuthChecker } from 'type-graphql';
import { AppContext } from '../shared/app-context';

export const authChecker: AuthChecker<AppContext> = (
  { context: { userId, role } },
  roles
) => {
  if (roles.length === 0) {
    // if `@Authorized()`, check only is user exist
    return userId !== undefined;
  }
  if (!userId) {
    // and if no user, restrict access
    return false;
  }
  if (roles.includes(role)) {
    // grant access if the roles overlap
    return true;
  }

  // no roles matched, restrict access
  return false;
};

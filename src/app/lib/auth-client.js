import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// No baseURL on purpose: the browser talks to the same site it was loaded
// from, so this works on localhost and on Vercel without any change.
export const authClient = createAuthClient({
  plugins: [jwtClient()],
});

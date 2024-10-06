import { getAuth } from "@clerk/nextjs/server"; // For server-side sessions
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { users } from "./db/schema";


// Clerk will handle sessions, so you don’t need an adapter or provider setup.
export const getServerAuthSession = async (req: any, res: any) => {
  // Clerk's way of getting a session server-side
  const { userId } = getAuth(req);
  const userAuth = getAuth(req);

  if (!userId) {
    return null; // If not logged in, return null
  }

  // Fetch user details based on the Clerk session
  // const user = await users.getUser(userId);
  const user = userAuth;

  return {
    user: {
      id: userId,
      // You can add more custom properties here, like roles
      // email: user.emailAddresses[0].emailAddress,
    },
  };
};

// Since Clerk handles session management automatically, 
// you don’t need to declare custom callbacks like with NextAuth.
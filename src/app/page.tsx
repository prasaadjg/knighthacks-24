import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import UserProfile from "./_components/UserProfile";
import { getAuth } from "@clerk/nextjs/server";
import { users } from "~/server/db/schema";

export default async function Home() {

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">

        <div className="fixed top-4 right-4">
          <UserButton />
        </div>

        <Link href='/test'>Test</Link>

        <Link href='/dashboard'>
          <button>Dashboard</button>
        </Link>

          {/* SignedOut component to show login button when the user is not signed in */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
              </button>
            </SignInButton>
          </SignedOut>

          {/* SignedIn component to show a sign out button and user info */}
          <SignedIn>
            <p className="text-xl">{"Welcome! You're signed in."}</p>
            <SignOutButton>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Logout
              </button>
            </SignOutButton>

            <UserProfile />
          </SignedIn>
      </main>
    </HydrateClient>
  );
}

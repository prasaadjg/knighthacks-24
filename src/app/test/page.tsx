"use client"

import { useAuth } from "@clerk/clerk-react";
import Link from "next/link";
import useUserIdStore from "~/hooks/userIdStore";
import { api } from "~/trpc/react";

export default function page() {
  const isSignedIn = useAuth().isSignedIn;

  return (
    <div className="p-2">
      <h1 className="text-4xl pb-4">Users Fetch</h1>

      <p>
        Signed in: {isSignedIn ? 'Yes' : 'No'}
      </p>

      <Link href='/'>Back</Link>

    </div>
  )
}
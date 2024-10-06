import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";

import { env } from "~/env";

export const metadata: Metadata = {
  title: "MonkeyMeet",
  description: "Monkey see, monkey schedule.",
  icons: [{ rel: "icon", url: "/favicon.PNG" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} 
    >
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users";
import { memberRouter } from "./routers/members";
import { friendRouter } from "./routers/friends";
import { groupsRouter } from "./routers/groups";
import { meetingsRouter } from "./routers/meetings";
import { availabilitiesRouter } from "./routers/availabilities";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  members: memberRouter,
  friends: friendRouter,
  groups: groupsRouter,
  meetings: meetingsRouter,
  availabilities: availabilitiesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

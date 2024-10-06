import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq, and } from "drizzle-orm";
import { friends } from "~/server/db/schema";

export const friendRouter = createTRPCRouter({
    // add friend (create relation between two users)
    addFriend: publicProcedure
        .input(z.object({
            userId: z.number(), 
            friendId: z.number(),
        }))
        .mutation(async ({ ctx, input}) => {
            await ctx.db.insert(friends).values({
                userId: input.userId, 
                friendId: input.friendId,
            });
        }),
    
    // get a user's friends based on their id
    getFriendsById: publicProcedure
        .input(z.object({ userId: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db 
                .select({ friendId: friends.friendId })
                .from(friends)
                .where(eq(friends.userId, input.userId));
        }),

    // remove friend (delete relation between two users)
    deleteFriend: publicProcedure 
        .input(z.object({
            userId: z.number(), 
            friendId: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .delete(friends)
                .where(and(eq(friends.userId, input.userId), eq(friends.friendId, input.friendId)));
        }),

})
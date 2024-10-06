import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq, and } from "drizzle-orm";
import { availabilities, members, users } from "~/server/db/schema";

export const memberRouter = createTRPCRouter({
    getUsersByGroup: publicProcedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ ctx, input }) => {
      // Query to fetch users with display name from members table
        const usersList = await ctx.db
            .select({
            userId: members.userId,
          displayName: users.displayName, // Use `users` table for display name
        })
        .from(members)
        .leftJoin(users, eq(members.userId, users.id)) // Join with users table
        .where(eq(members.groupId, input.groupId));

      // Fetch availability for the group
        const availability = await ctx.db
            .select({
            userId: availabilities.userId,
            start: availabilities.start,
            end: availabilities.end,
            })
            .from(availabilities)
            .where(eq(availabilities.groupId, input.groupId));

        // Combine users with their availabilities
        return usersList.map((user) => ({
            ...user,
            availability: availability.filter((a) => a.userId === user.userId), // Attach availability to each user
        }));
    }),

    // add member (create relation between a user and a group)
    addMember: publicProcedure 
    .input(z.object({
        groupId: z.number(),
        userId: z.number(), 
        userColor: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
        await ctx.db.insert(members).values({
        groupId: input.groupId, 
        userId: input.userId, 
        userColor: input.userColor,
        });
    }),

    // get all groups a user in by userId
    getGroupsByUser: publicProcedure 
        .input(z.object({ userId: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db 
                .select({ groupId: members.groupId })
                .from(members) 
                .where(eq(members.userId, input.userId));
        }),
    
    // remove member (delete relation between a user and a group)
    deleteMember: publicProcedure 
        .input(z.object({
            groupId: z.number(), 
            userId: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .delete(members)
                .where(and(eq(members.groupId, input.groupId), eq(members.userId, input.userId)));
        }),
})

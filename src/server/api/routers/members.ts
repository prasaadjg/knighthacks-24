import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq, and } from "drizzle-orm";
import { members } from "~/server/db/schema";

export const memberRouter = createTRPCRouter({
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
    
    // get all users in a group by groupId
    // TODO: ability to filter by user? 
    getUsersByGroup: publicProcedure
        .input(z.object({ groupId: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ userId: members.userId })
                .from(members)
                .where(eq(members.groupId, input.groupId));
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

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq } from "drizzle-orm";
import { groups, members, meetings, availabilities } from "~/server/db/schema";

export const groupsRouter = createTRPCRouter({
    // Get group name and icon by ID
    getGroupName: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
    const result = await ctx.db
        .select({
        groupName: groups.groupName,
        iconUrl: groups.iconUrl, // Include iconUrl
        })
        .from(groups)
        .where(eq(groups.id, input.id));

    return result.length > 0 ? result[0] : null; // Return the first object if it exists
    }),

    // Create a new group
    createGroup: publicProcedure
        .input(z.object({
            ownerId: z.number(), 
            groupName: z.string(), 
            start: z.string(), 
            end: z.string(), 
            iconUrl: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(groups).values({
                ownerId: input.ownerId, 
                groupName: input.groupName, 
                start: input.start, 
                end: input.end, 
                iconUrl: input.iconUrl,
            });
        }),

    // Get group start time by ID (returns a single object)
    getStart: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const result = await ctx.db
                .select({ start: groups.start })
                .from(groups)
                .where(eq(groups.id, input.id));

            return result.length > 0 ? result[0] : null; // Return the first object if it exists
        }),

    // Get group end time by ID (returns a single object)
    getEnd: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const result = await ctx.db
                .select({ end: groups.end })
                .from(groups)
                .where(eq(groups.id, input.id));

            return result.length > 0 ? result[0] : null; // Return the first object if it exists
        }),

    // Get group owner by ID (returns a single object)
    getOwner: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const result = await ctx.db
                .select({ ownerId: groups.ownerId })
                .from(groups)
                .where(eq(groups.id, input.id));

            return result.length > 0 ? result[0] : null; // Return the first object if it exists
        }),

    // Get group icon URL by ID (returns a single object)
    getIconUrl: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const result = await ctx.db
                .select({ iconUrl: groups.iconUrl })
                .from(groups)
                .where(eq(groups.id, input.id));

            return result.length > 0 ? result[0] : null; // Return the first object if it exists
        }),

    // Change group name
    changeGroupName: publicProcedure
        .input(z.object({
            id: z.number(), 
            newName: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .update(groups)
                .set({ groupName: input.newName })
                .where(eq(groups.id, input.id));
        }),

    // Change group icon URL
    changeIconUrl: publicProcedure 
        .input(z.object({
            id: z.number(), 
            newUrl: z.string(), 
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .update(groups)
                .set({ iconUrl: input.newUrl })
                .where(eq(groups.id, input.id));
        }),

    // Change group start time
    changeStart: publicProcedure 
        .input(z.object({ 
            id: z.number(), 
            newStart: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .update(groups)
                .set({ start: input.newStart })
                .where(eq(groups.id, input.id));
        }),

    // Change group end time
    changeEnd: publicProcedure 
        .input(z.object({ 
            id: z.number(), 
            newEnd: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .update(groups) 
                .set({ end: input.newEnd })
                .where(eq(groups.id, input.id));
        }),

    // Delete group and related records
    deleteGroup: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.batch([
                // Delete dependent records (members, meetings, availabilities)
                ctx.db.delete(members).where(eq(members.groupId, input.id)), 
                ctx.db.delete(meetings).where(eq(meetings.groupId, input.id)), 
                ctx.db.delete(availabilities).where(eq(availabilities.groupId, input.id)),

                // Delete the group
                ctx.db.delete(groups).where(eq(groups.id, input.id))
            ]);
        }),
})
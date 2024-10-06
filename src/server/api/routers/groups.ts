import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq } from "drizzle-orm";
import { groups, members, meetings, availabilities } from "~/server/db/schema";

export const groupsRouter = createTRPCRouter({
    // create new group
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
    
    // get group name
    getGroupName: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ groupName: groups.groupName })
                .from(groups)
                .where(eq(groups.id, input.id))
        }),

    // change group name
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
    
    // get group icon URL
    getIconUrl: publicProcedure 
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ iconUrl: groups.iconUrl })
                .from(groups)
                .where(eq(groups.id, input.id))
        }),  
    
    // change group icon
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

    // get group owner
    getOwner: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ ownerId: groups.ownerId })
                .from(groups)
                .where(eq(groups.id, input.id));
        }),
    
    // change group owner
    changeOwner: publicProcedure
        .input(z.object({
            id: z.number(), 
            newOwnerId: z.number(), 
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .update(groups)
                .set({ ownerId: input.newOwnerId })
                .where(eq(groups.id, input.id));
        }),
    
    // get the start date/time of the group
    // individual date/time must be parsed out by middleware
    getStart: publicProcedure 
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ start: groups.start })
                .from(groups)
                .where(eq(groups.id, input.id));
        }),


    // change group start date/time
    // date/time is entered as one string 
    // availabilities that no longer fit within constraints must be removed by middleware 
    // must also change availabilities that fit but are changed by new constraints 
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

    // get group end date/time 
    // individual date/time must be parsed out by middleware
    getEnd: publicProcedure 
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db 
                .select({ end: groups.end })
                .from(groups) 
                .where(eq(groups.id, input.id));
        }),

    // change group end date/time
    // date/time is entered as one string 
    // availabilities that no longer fit within constraints must be removed by middleware
    // must also change availabilities that fit but are changed by new constraints
    changeEnd: publicProcedure 
        .input(z.object({ 
            id: z.number(), 
            newEnd: z.string()
         }))
         .mutation(async ({ ctx, input }) => {
            await ctx.db 
                .update(groups) 
                .set({ end: input.newEnd })
                .where(eq(groups.id, input.id))
         }),

    // delete group
    deleteGroup: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.batch([
                // delete records that depend on groups for foreign key 
                ctx.db.delete(members).where(eq(members.groupId, input.id)), 
                ctx.db.delete(meetings).where(eq(meetings.groupId, input.id)), 
                ctx.db.delete(availabilities).where(eq(availabilities.groupId, input.id)),

                // delete group record 
                ctx.db.delete(groups).where(eq(groups.id, input.id))
            ]);
        }),
})
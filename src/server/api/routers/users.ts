import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq, or } from "drizzle-orm";
import { users, friends, members, availabilities } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
    // create new user 
    createUser: publicProcedure 
        .input(z.object({
            authId: z.string(), 
            displayName: z.string(), 
            iconUrl: z.string(), 
            timeCreated: z.string().time(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(users).values({
                authId: input.authId, 
                displayName: input.displayName,
                iconUrl: input.iconUrl, 
                timeCreated: input.timeCreated, 
            });
        }),

    // get primary key 
    getIdFromUId: publicProcedure
        .input(z.object({ authId: z.string() }))
        .query(async ({ ctx, input }) => {
            // Perform the database query
            const result = await ctx.db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.authId, input.authId));

        // Handle the case where no user is found
        if (result.length === 0) {
            throw new Error(`User with authId ${input.authId} not found`);
        }

        // Return the first result, assuming authId is unique
        return result[0];
    }),
    

    // get user's display name 
    getDisplayName: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ displayName: users.displayName })
                .from(users)
                .where(eq(users.id, input.id));
        }),

    // get user's display name 
    getDisplayNameWithUid: publicProcedure
        .input(z.object({ uid: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ displayName: users.displayName })
                .from(users)
                .where(eq(users.authId, input.uid));
        }),
    
    // change user's display name
    changeDisplayName: publicProcedure
        .input(z.object({ 
            id: z.number(),
            newName: z.string(),  
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .update(users)
                .set({ displayName: input.newName })
                .where(eq(users.id, input.id));
        }),

    // get user's icon URL 
    getIconUrl: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select({ iconUrl: users.iconUrl })
                .from(users)
                .where(eq(users.id, input.id));
        }),
    
    // change user's icon URL 
    changeIconUrl: publicProcedure 
        .input(z.object({
            id: z.number(), 
            newUrl: z.string(),
        }))
        .mutation(async ({ ctx, input}) => {
            await ctx.db
                .update(users)
                .set({ iconUrl: input.newUrl })
                .where(eq(users.id, input.id))
        }),
    
    // delete user
    deleteUser: publicProcedure 
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.batch([
                // delete records that depend on users for foreign key
                ctx.db.delete(friends).where(or(eq(friends.userId, input.id), eq(friends.friendId, input.id))),
                ctx.db.delete(members).where(eq(members.userId, input.id)),
                ctx.db.delete(availabilities).where(eq(availabilities.userId, input.id)),

                // delete user record 
                ctx.db.delete(users).where(eq(users.id, input.id))
            ]);
        }),
})

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
    // create new user 
    createUser: publicProcedure 
        .input(z.object({
            id: z.number(), 
            authId: z.number(), 
            displayName: z.string(), 
            iconUrl: z.string(), 
            timeCreated: z.string().time(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(users).values({
                id: input.id, 
                authId: input.authId, 
                displayName: input.displayName,
                iconUrl: input.iconUrl, 
                timeCreated: input.timeCreated, 
            });
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
    
    // TODO: delete user
})

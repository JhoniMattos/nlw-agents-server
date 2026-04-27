import { count, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
  app.get("/rooms", async () => {
    const results = await db
      .select({
        id: schema.rooms.id,
        name: schema.rooms.name,
        createdAt: schema.rooms.createdAt,
        questionsCount: count().as("questionsCount"),
      })
      .from(schema.rooms)
      .leftJoin(schema.questions, eq(schema.questions.roomId, schema.rooms.id))
      .groupBy(schema.rooms.id, schema.rooms.name, schema.rooms.createdAt)
      .orderBy(schema.rooms.createdAt);

    return results;
  });
};

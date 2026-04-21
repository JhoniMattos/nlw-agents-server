ALTER TABLE "rooms" RENAME COLUMN "create_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "description" text;
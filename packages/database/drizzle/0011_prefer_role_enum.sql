CREATE TYPE "public"."role" AS ENUM('provider', 'seeker', 'admin');--> statement-breakpoint
ALTER TABLE "app"."user_role" DROP CONSTRAINT "user_role_role_id_role_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."user_role" DROP CONSTRAINT "user_role_user_id_role_id_pk";--> statement-breakpoint
ALTER TABLE "app"."user_role" ADD COLUMN "role" "role" NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."user_role" DROP COLUMN "role_id";--> statement-breakpoint
ALTER TABLE "app"."user_role" ADD CONSTRAINT "user_role_user_id_role_pk" PRIMARY KEY("user_id","role");--> statement-breakpoint
ALTER TABLE "app"."role" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "app"."role" CASCADE;
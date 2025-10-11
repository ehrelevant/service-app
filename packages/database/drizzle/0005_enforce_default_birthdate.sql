ALTER TABLE "app"."user" ALTER COLUMN "birth_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "app"."user" ALTER COLUMN "birth_date" SET DEFAULT now();
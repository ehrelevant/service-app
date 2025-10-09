CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TABLE "app"."roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "app"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"firstName" text DEFAULT '' NOT NULL,
	"middleName" text DEFAULT '' NOT NULL,
	"lastName" text DEFAULT '' NOT NULL,
	"password" text NOT NULL,
	"phoneNumber" text NOT NULL,
	"birthDate" date NOT NULL,
	"avatarUrl" text,
	"isVerified" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phoneNumber_unique" UNIQUE("phoneNumber"),
	CONSTRAINT "user_email_non_empty" CHECK ("app"."users"."email" <> ''),
	CONSTRAINT "user_phone_number_non_empty" CHECK ("app"."users"."phoneNumber" <> '')
);
--> statement-breakpoint
CREATE TABLE "app"."user_roles" (
	"userId" uuid NOT NULL,
	"roleId" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_roles_userId_roleId_pk" PRIMARY KEY("userId","roleId")
);
--> statement-breakpoint
ALTER TABLE "app"."user_roles" ADD CONSTRAINT "user_roles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "app"."users"("id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."user_roles" ADD CONSTRAINT "user_roles_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "app"."roles"("id") ON DELETE no action ON UPDATE cascade;
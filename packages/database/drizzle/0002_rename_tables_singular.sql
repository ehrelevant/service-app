ALTER TABLE "app"."roles" RENAME TO "role";--> statement-breakpoint
ALTER TABLE "app"."users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "app"."user_roles" RENAME TO "user_role";--> statement-breakpoint
ALTER TABLE "app"."role" DROP CONSTRAINT "roles_name_unique";--> statement-breakpoint
ALTER TABLE "app"."user" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "app"."user" DROP CONSTRAINT "users_phoneNumber_unique";--> statement-breakpoint
ALTER TABLE "app"."user" DROP CONSTRAINT "user_email_non_empty";--> statement-breakpoint
ALTER TABLE "app"."user" DROP CONSTRAINT "user_phone_number_non_empty";--> statement-breakpoint
ALTER TABLE "app"."user_role" DROP CONSTRAINT "user_roles_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."user_role" DROP CONSTRAINT "user_roles_roleId_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."user_role" DROP CONSTRAINT "user_roles_userId_roleId_pk";--> statement-breakpoint
ALTER TABLE "app"."user_role" ADD CONSTRAINT "user_role_userId_roleId_pk" PRIMARY KEY("userId","roleId");--> statement-breakpoint
ALTER TABLE "app"."user_role" ADD CONSTRAINT "user_role_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "app"."user"("id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."user_role" ADD CONSTRAINT "user_role_roleId_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "app"."role"("id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."role" ADD CONSTRAINT "role_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "app"."user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "app"."user" ADD CONSTRAINT "user_phoneNumber_unique" UNIQUE("phoneNumber");--> statement-breakpoint
ALTER TABLE "app"."user" ADD CONSTRAINT "user_email_non_empty" CHECK ("app"."user"."email" <> '');--> statement-breakpoint
ALTER TABLE "app"."user" ADD CONSTRAINT "user_phone_number_non_empty" CHECK ("app"."user"."phoneNumber" <> '');
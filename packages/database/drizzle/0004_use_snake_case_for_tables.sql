ALTER TABLE "app"."user" RENAME COLUMN "firstName" TO "first_name";--> statement-breakpoint
ALTER TABLE "app"."user" RENAME COLUMN "middleName" TO "middle_name";--> statement-breakpoint
ALTER TABLE "app"."user" RENAME COLUMN "lastName" TO "last_name";--> statement-breakpoint
ALTER TABLE "app"."user" RENAME COLUMN "phoneNumber" TO "phone_number";--> statement-breakpoint
ALTER TABLE "app"."user" RENAME COLUMN "birthDate" TO "birth_date";--> statement-breakpoint
ALTER TABLE "app"."user" RENAME COLUMN "emailVerified" TO "email_verified";--> statement-breakpoint
ALTER TABLE "app"."user" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "app"."user" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "app"."user_role" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "app"."user_role" RENAME COLUMN "roleId" TO "role_id";--> statement-breakpoint
ALTER TABLE "auth"."account" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "auth"."account" RENAME COLUMN "accountId" TO "account_id";--> statement-breakpoint
ALTER TABLE "auth"."account" RENAME COLUMN "accessToken" TO "access_token";--> statement-breakpoint
ALTER TABLE "auth"."account" RENAME COLUMN "refreshToken" TO "refresh_token";--> statement-breakpoint
ALTER TABLE "auth"."account" RENAME COLUMN "accessTokenExpiresAt" TO "access_token_expires_at";--> statement-breakpoint
ALTER TABLE "auth"."account" RENAME COLUMN "refreshTokenExpiresAt" TO "refresh_token_expires_at";--> statement-breakpoint
ALTER TABLE "auth"."account" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "auth"."account" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "auth"."session" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "auth"."session" RENAME COLUMN "expiresAt" TO "expires_at";--> statement-breakpoint
ALTER TABLE "auth"."session" RENAME COLUMN "ipAddress" TO "ip_address";--> statement-breakpoint
ALTER TABLE "auth"."session" RENAME COLUMN "userAgent" TO "user_agent";--> statement-breakpoint
ALTER TABLE "auth"."session" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "auth"."session" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "auth"."verification" RENAME COLUMN "expiresAt" TO "expires_at";--> statement-breakpoint
ALTER TABLE "auth"."verification" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "auth"."verification" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "app"."user" DROP CONSTRAINT "user_phoneNumber_unique";--> statement-breakpoint
ALTER TABLE "app"."user" DROP CONSTRAINT "user_phone_number_non_empty";--> statement-breakpoint
ALTER TABLE "app"."user_role" DROP CONSTRAINT "user_role_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."user_role" DROP CONSTRAINT "user_role_roleId_role_id_fk";
--> statement-breakpoint
ALTER TABLE "auth"."account" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "auth"."session" DROP CONSTRAINT "session_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."user_role" DROP CONSTRAINT "user_role_userId_roleId_pk";--> statement-breakpoint
ALTER TABLE "app"."user_role" ADD CONSTRAINT "user_role_user_id_role_id_pk" PRIMARY KEY("user_id","role_id");--> statement-breakpoint
ALTER TABLE "app"."user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."user_role" ADD CONSTRAINT "user_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "app"."role"("id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."user" ADD CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number");--> statement-breakpoint
ALTER TABLE "app"."user" ADD CONSTRAINT "user_phone_number_non_empty" CHECK ("app"."user"."phone_number" <> '');
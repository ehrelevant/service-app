CREATE TABLE "app"."address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text,
	"coordinates" "geography" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."agency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"avatar_url" text
);
--> statement-breakpoint
CREATE TABLE "app"."booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"seeker_id" uuid NOT NULL,
	"request_id" uuid NOT NULL,
	"cost" numeric(10, 2) DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."message_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" uuid NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."portfolio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "app"."portfolio_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."provider" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"agency_id" uuid,
	"is_accepting" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_type_id" uuid NOT NULL,
	"seeker_id" uuid NOT NULL,
	"address_id" uuid NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."request_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"rating" integer,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "review_rating_range" CHECK ("app"."review"."rating" IS NULL OR "app"."review"."rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "app"."review_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."seeker" (
	"user_id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_type_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"initial_cost" numeric(10, 2) DEFAULT 0 NOT NULL,
	"is_enabled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."service_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon_url" text
);
--> statement-breakpoint
ALTER TABLE "app"."user_role" DROP CONSTRAINT "user_role_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."user_role" DROP CONSTRAINT "user_role_role_id_role_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."booking" ADD CONSTRAINT "booking_provider_id_provider_user_id_fk" FOREIGN KEY ("provider_id") REFERENCES "app"."provider"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."booking" ADD CONSTRAINT "booking_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "app"."service"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."booking" ADD CONSTRAINT "booking_seeker_id_seeker_user_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "app"."seeker"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."booking" ADD CONSTRAINT "booking_request_id_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "app"."request"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."message" ADD CONSTRAINT "message_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "app"."booking"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."message" ADD CONSTRAINT "message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."message_image" ADD CONSTRAINT "message_image_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "app"."message"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."portfolio" ADD CONSTRAINT "portfolio_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "app"."service"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."portfolio_image" ADD CONSTRAINT "portfolio_image_portfolio_id_portfolio_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "app"."portfolio"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."provider" ADD CONSTRAINT "provider_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."provider" ADD CONSTRAINT "provider_agency_id_agency_id_fk" FOREIGN KEY ("agency_id") REFERENCES "app"."agency"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."request" ADD CONSTRAINT "request_service_type_id_service_type_id_fk" FOREIGN KEY ("service_type_id") REFERENCES "app"."service_type"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."request" ADD CONSTRAINT "request_seeker_id_seeker_user_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "app"."seeker"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."request" ADD CONSTRAINT "request_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "app"."address"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."request_image" ADD CONSTRAINT "request_image_request_id_request_id_fk" FOREIGN KEY ("request_id") REFERENCES "app"."request"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."review" ADD CONSTRAINT "review_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "app"."service"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."review_image" ADD CONSTRAINT "review_image_review_id_review_id_fk" FOREIGN KEY ("review_id") REFERENCES "app"."review"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."seeker" ADD CONSTRAINT "seeker_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."service" ADD CONSTRAINT "service_service_type_id_service_type_id_fk" FOREIGN KEY ("service_type_id") REFERENCES "app"."service_type"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."service" ADD CONSTRAINT "service_provider_id_provider_user_id_fk" FOREIGN KEY ("provider_id") REFERENCES "app"."provider"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "app"."user_role" ADD CONSTRAINT "user_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "app"."role"("id") ON DELETE cascade ON UPDATE cascade;
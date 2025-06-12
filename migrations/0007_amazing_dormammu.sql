CREATE TABLE "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"full_name" text NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"address_line1" text NOT NULL,
	"address_line2" text,
	"city" text NOT NULL,
	"state" text,
	"postal_code" varchar(20),
	"country" text NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
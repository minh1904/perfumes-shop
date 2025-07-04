ALTER TABLE "orders" ADD COLUMN "shipping_full_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_phone" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address_line1" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address_line2" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_state" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_postal_code" varchar(20);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_country" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "address_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
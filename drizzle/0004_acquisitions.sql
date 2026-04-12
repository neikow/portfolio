CREATE TYPE "acquisition_type" AS ENUM ('cv', 'cold-email');
--> statement-breakpoint
CREATE TYPE "acquisition_status" AS ENUM ('pending', 'processing', 'done', 'error');
--> statement-breakpoint
CREATE TYPE "acquisition_tone" AS ENUM ('professional', 'casual', 'enthusiastic', 'concise');
--> statement-breakpoint
CREATE TABLE "acquisitions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "acquisitions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" "acquisition_type" NOT NULL,
	"status" "acquisition_status" NOT NULL DEFAULT 'pending',
	"tone" "acquisition_tone" NOT NULL DEFAULT 'professional',
	"language" text,
	"input_content" text NOT NULL,
	"generated_content" text,
	"error_message" text,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp
);

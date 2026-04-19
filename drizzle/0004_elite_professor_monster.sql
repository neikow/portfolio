CREATE TYPE "public"."acquisition_status" AS ENUM('pending', 'processing', 'done', 'error');--> statement-breakpoint
CREATE TYPE "public"."acquisition_tone" AS ENUM('professional', 'casual', 'enthusiastic', 'concise');--> statement-breakpoint
CREATE TYPE "public"."acquisition_type" AS ENUM('cv', 'cold-email');--> statement-breakpoint
CREATE TABLE "acquisitions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "acquisitions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" "acquisition_type" NOT NULL,
	"status" "acquisition_status" DEFAULT 'pending' NOT NULL,
	"tone" "acquisition_tone" DEFAULT 'professional' NOT NULL,
	"language" text,
	"input_content" text NOT NULL,
	"input_blocks" json,
	"generated_content" text,
	"error_message" text,
	"pdf_url" text,
	"pdf_status" text DEFAULT 'idle' NOT NULL,
	"pdf_template_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "certifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"issuer" text NOT NULL,
	"issuer_url" text,
	"logo_url" text,
	"issued_at" timestamp NOT NULL,
	"expires_at" timestamp,
	"credential_url" text,
	"description" text,
	"edited_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cv_templates" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cv_templates_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" text NOT NULL,
	"html" text NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "cv_templates_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "educations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "educations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"school" text NOT NULL,
	"degree" text NOT NULL,
	"field" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"logo_url" text DEFAULT '' NOT NULL,
	"website_url" text,
	"school_projects" json DEFAULT '[]'::json NOT NULL,
	"edited_at" timestamp
);

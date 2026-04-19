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

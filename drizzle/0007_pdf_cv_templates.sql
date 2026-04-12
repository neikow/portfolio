ALTER TABLE "acquisitions" ADD COLUMN "pdf_url" text;
ALTER TABLE "acquisitions" ADD COLUMN "pdf_status" text NOT NULL DEFAULT 'idle';
ALTER TABLE "acquisitions" ADD COLUMN "pdf_template_type" text;
--> statement-breakpoint
CREATE TABLE "cv_templates" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cv_templates_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" text NOT NULL,
	"html" text NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "cv_templates_type_unique" UNIQUE("type")
);

CREATE TABLE "blog_posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"content" text NOT NULL,
	"cover_image_url" text NOT NULL,
	"slug" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"time_published" timestamp with time zone,
	"last_modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"time_edited" timestamp with time zone NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gallery_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"filename" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);

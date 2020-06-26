
DROP TABLE IF EXISTS rental;
DROP TABLE IF EXISTS movie_tags_tag;
DROP TABLE IF EXISTS movie;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS "user";

-- Table: role

DROP DATABASE IF EXISTS blockbuster_testdb;

CREATE DATABASE blockbuster_testdb;

\c blockbuster_testdb;


-- Table: tag

CREATE TABLE tag
(
  id serial NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE TABLE role
(
  id serial NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


-- Table: movie

CREATE TABLE movie
(
  id serial NOT NULL,
  title character varying NOT NULL,
  description character varying NOT NULL,
  poster character varying NOT NULL,
  stock integer NOT NULL,
  trailer character varying NOT NULL,
  price numeric(5,2) NOT NULL,
  likes integer NOT NULL DEFAULT 0,
  availability boolean NOT NULL,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
  "modifiedAt" timestamp without time zone,
  "deletedAt" timestamp without time zone,
  CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


-- Table: "user"

CREATE TABLE "user"
(
  id serial NOT NULL,
  email character varying NOT NULL,
  username character varying NOT NULL,
  password character varying NOT NULL,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
  "modifiedAt" timestamp without time zone,
  "deletedAt" timestamp without time zone,
  "roleId" integer,
  CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
  CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId")
      REFERENCES role (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);


-- Table: movie_tags_tag

CREATE TABLE movie_tags_tag
(
  "movieId" integer NOT NULL,
  "tagId" integer NOT NULL,
  CONSTRAINT "PK_a63fb1cc6083d9417e67029dece" PRIMARY KEY ("movieId", "tagId"),
  CONSTRAINT "FK_5c229532ab9c842d9f712c44a4d" FOREIGN KEY ("movieId")
      REFERENCES movie (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT "FK_7f5d867068b30d8263854b3e98d" FOREIGN KEY ("tagId")
      REFERENCES tag (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE movie_tags_tag
  OWNER TO postgres;

-- Index: "IDX_5c229532ab9c842d9f712c44a4"

-- DROP INDEX "IDX_5c229532ab9c842d9f712c44a4";

CREATE INDEX "IDX_5c229532ab9c842d9f712c44a4"
  ON movie_tags_tag
  USING btree
  ("movieId");

-- Index: "IDX_7f5d867068b30d8263854b3e98"

-- DROP INDEX "IDX_7f5d867068b30d8263854b3e98";

CREATE INDEX "IDX_7f5d867068b30d8263854b3e98"
  ON movie_tags_tag
  USING btree
  ("tagId");



-- Table: rental

CREATE TABLE rental
(
  id serial NOT NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
  status integer NOT NULL,
  "userId" integer,
  "movieId" integer,
  CONSTRAINT "PK_a20fc571eb61d5a30d8c16d51e8" PRIMARY KEY (id),
  CONSTRAINT "FK_2f2be23e8f7d76f14807c7564e8" FOREIGN KEY ("movieId")
      REFERENCES movie (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_5c91d10c5ee7afddcb2dbbfbbd0" FOREIGN KEY ("userId")
      REFERENCES "user" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);

INSERT INTO role (name)
    VALUES ('ADMIN'),('CLIENT');

INSERT INTO "user"(email, username, password, "isActive", "roleId")
    VALUES ('admin@admin.com','admin','$2b$10$yFvC2wic9FdfpLcfm6X11.zaV0iUJ5Lx2WPVm/dAxgKHeJon9CNwq',TRUE,1);
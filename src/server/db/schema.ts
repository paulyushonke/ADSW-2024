// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `adsw_lab2_${name}`);

export const posts = createTable(
  "employees",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    birthday: varchar("birthday", { length: 256 }),
    gender: varchar("gender", { length: 256 }),
    salary: varchar("salary", { length: 256 }),
    progLang: varchar("prog_lang", { length: 256 }),
    importance: varchar("importance", { length: 256 }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

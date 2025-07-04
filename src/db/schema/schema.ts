import { mysqlTable as table, index } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/mysql-core";

export const users = table("users", {
  id: t.int("id").primaryKey().autoincrement(),
  email: t.varchar("email", { length: 255 }).notNull().unique(),
  password: t.varchar("password", { length: 255 }).notNull(),
  name: t.varchar("name", { length: 100 }).notNull(),
  isActive: t.boolean("is_active").default(true),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const customerProfile = -table("customer_profile", {
  id: t.int("id").primaryKey().autoincrement(),
  userId: t
    .int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  phone: t.varchar("phone", { length: 20 }),
  totalSpent: t
    .decimal("total_spent", { precision: 10, scale: 2 })
    .default("0.00"),
  ordersCount: t.int("orders_count").default(0),
  lastOrderAt: t.timestamp("last_order_at"),
  dateOfBirth: t.timestamp("date_of_birth"),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const customerAddress = table("customer_address", {
  id: t.int("id").primaryKey().autoincrement(),
  userId: t
    .int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  address1: t.varchar("address1", { length: 255 }).notNull(),
  address2: t.varchar("address2", { length: 255 }),
  city: t.varchar("city", { length: 100 }).notNull(),
  province: t.varchar("province", { length: 100 }),
  country: t.varchar("country", { length: 100 }).notNull(),
  zip: t.varchar("zip", { length: 20 }).notNull(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const refreshTokens = table(
  "refresh_tokens",
  {
    id: t.int("id").primaryKey().autoincrement(),
    userId: t
      .int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    token: t.varchar("token", { length: 255 }).notNull(),
    expiresAt: t.timestamp("expires_at").notNull(),
    isRevoked: t.boolean("is_revoked").default(false).notNull(),
    createdAt: t.timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_refresh_tokens_user_id").on(table.userId),
    index("idx_refresh_tokens_expires_at").on(table.expiresAt),
    index("idx_refresh_tokens_is_revoked").on(table.isRevoked),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

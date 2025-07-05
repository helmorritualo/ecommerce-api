import { eq } from "drizzle-orm";
import { db } from "@/config/database";
import { customerProfile, users } from "@/db/schema/schema";

type Customer = typeof customerProfile.$inferInsert;

export const createCustomerProfile = async (customerData: Customer) => {
  const [customer] = await db.insert(customerProfile).values(customerData);

  return customer;
};

export const getCustomerProfile = async (id: number) => {
  const [customer] = await db
    .select({
      id: users.id,
      email: users.email,
      name: customerProfile.name,
      phone: customerProfile.phone,
      adddress1: customerProfile.address1,
      address2: customerProfile.address2,
      city: customerProfile.city,
      province: customerProfile.province,
      country: customerProfile.country,
      zip: customerProfile.zip,
      totalSpent: customerProfile.totalSpent,
      orderCount: customerProfile.ordersCount,
      lastOrderAt: customerProfile.lastOrderAt,
    })
    .from(customerProfile)
    .leftJoin(users, eq(customerProfile.id, users.id))
    .where(eq(customerProfile.id, id));

  return customer;
};

export const getAllCustomerProfile = async () => {
  const [customers] = await db
    .select({
      id: users.id,
      email: users.email,
      name: customerProfile.name,
      phone: customerProfile.phone,
      adddress1: customerProfile.address1,
      address2: customerProfile.address2,
      city: customerProfile.city,
      province: customerProfile.province,
      country: customerProfile.country,
      zip: customerProfile.zip,
      totalSpent: customerProfile.totalSpent,
      orderCount: customerProfile.ordersCount,
      lastOrderAt: customerProfile.lastOrderAt,
    })
    .from(customerProfile)
    .leftJoin(users, eq(customerProfile.id, users.id));

  return customers;
};

export const updateCustomerProfile = async (
  id: number,
  customerData: Customer
) => {
  const [customer] = await db
    .update(customerProfile)
    .set(customerData)
    .where(eq(customerProfile.id, id));

  return customer;
};

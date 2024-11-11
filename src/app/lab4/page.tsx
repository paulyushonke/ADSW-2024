import { db } from "~/server/db";
import { EmployeeManagement } from "./EmployeeManagement";
import { posts } from "~/server/db/schema";

export default async function Page() {
  const employees = await db.select().from(posts);
  return <EmployeeManagement employees={employees} />;
}

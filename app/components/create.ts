"use server";

import { neon } from "@neondatabase/serverless";

export const create = async (formData: FormData) => {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const ticket = formData.get("ticket");
  const date = formData.get("date");

  await sql`INSERT INTO chamados (ticket, data) VALUES (${ticket}, ${date})`;
};

"use server";

import { neon } from "@neondatabase/serverless";

export const create = async (formData: FormData) => {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const ticket = formData.get("ticket");
  const date = formData.get("date");
  const codigo = formData.get("codigo");
  const status = formData.get("status");
  const tipo = formData.get("tipo");

  await sql`INSERT INTO chamados (ticket, data, codigo, status, tipo) VALUES (${ticket}, ${date}, ${codigo}, ${status}, ${tipo})`;
};

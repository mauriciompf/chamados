"use server";

import { neon } from "@neondatabase/serverless";
import { z } from "zod";

const ticketSchema = z.object({
  ticket: z.string().min(15, "Ticket must be at least 15 characters"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  codigo: z.string().optional(),
  status: z.string().optional(),
  tipo: z.string().optional(),
});

function getWeekdayOfMonth(date: any) {
  const dayOfMonth = date.getDate();
  return Math.ceil(dayOfMonth / 7);
}

export const create = async (formData: FormData) => {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const rawData = {
    ticket: formData.get("ticket"),
    date: formData.get("date"),
    codigo: formData.get("codigo"),
    status: formData.get("status"),
    tipo: formData.get("tipo"),
  };

  const result = ticketSchema.safeParse(rawData);

  const dateObj = new Date(result.data!.date);
  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date format");
  }
  const weekNumber = getWeekdayOfMonth(dateObj);

  await sql`
      INSERT INTO chamados 
        (ticket, data, codigo, status, tipo, semana) 
      VALUES 
        (${result.data!.ticket}, ${result.data!.date}, 
         ${result.data!.codigo}, ${result.data!.status}, 
         ${result.data!.tipo}, ${weekNumber})
    `;
};

"use server";

import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

async function testConnection() {
  try {
    const result = await sql`SELECT 1`;
    console.log("Database connection test:", result);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

// Call it when the server starts
testConnection();

// let isSeeded = false;

export async function GET() {
  try {
    const data = { message: "ok" };
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    NextResponse.json({ message: `error: ${error}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    console.log("Received Data:", formData);

    const { ticket, date } = formData;

    const result = await sql`
      INSERT INTO chamados (ticket, data)
      VALUES (${ticket}, ${date})
      RETURNING *
    `;

    return NextResponse.json(
      {
        message: "Data received successfully",
        data: result[0],
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Error processing request",
      },
      {
        status: 500,
      }
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     const placeholderData = "10/11/22";
//     const placeholderTicket = "164489164489";

//     const result = await sql`
//       INSERT INTO chamados (data, ticket)
//       VALUES (${placeholderData}, ${placeholderTicket})
//       RETURNING *
//     `;

//     return NextResponse.json({ chamado: result[0] }, { status: 201 });
//   } catch (error) {
//     console.error("POST error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// const seedChamados = async () => {
//   if (isSeeded) return { message: "Database already seeded", chamados: [] };

//   try {
//     const insertChamados = await Promise.all(
//       chamadoPlaceHolder.map(async (chamados) => {
//         const { data, semana, ticket, codigo, status, tipo, link } = chamados;

//         const result = await sql`
//           INSERT INTO chamados (
//             data, semana, ticket, codigo, status, tipo, link
//           ) VALUES (
//             ${data}, ${semana}, ${ticket}, ${codigo}, ${status}, ${tipo}, ${link}
//           ) RETURNING *
//         `;
//         return result[0];
//       })
//     );

//     isSeeded = true;

//     return {
//       message: "Database seeded successfully",
//       chamados: insertChamados,
//     };
//   } catch (error) {
//     console.error(error);
//   }
// };

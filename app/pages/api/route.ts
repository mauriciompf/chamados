"use server";

import { neon } from "@neondatabase/serverless";
import { chamadoPlaceHolder } from "../../placeholder-data";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

let isSeeded = false;

export async function POST(request: Request) {
  try {
    const placeholderData = "10/11/22";
    const placeholderTicket = "164489164489";

    const result = await sql`
      INSERT INTO chamados (data, ticket) 
      VALUES (${placeholderData}, ${placeholderTicket})
      RETURNING *
    `;

    return NextResponse.json({ chamado: result[0] }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const chamados = await sql`
SELECT EXISTS (
SELECT 1
FROM information_schema.tables
WHERE table_name = 'chamados'
) AS table_existence;
`;

    return NextResponse.json({ chamados }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     const chamadosCount = await sql("SELECT COUNT(*) FROM chamados");
//     if (Number(chamadosCount[0].count) === 0) await seedChamados();

//     const chamados = await sql("SELECT * FROM chamados");
//     return NextResponse.json({ chamados }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       {
//         message: "Internal server error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

const seedChamados = async () => {
  if (isSeeded) return { message: "Database already seeded", chamados: [] };

  try {
    const insertChamados = await Promise.all(
      chamadoPlaceHolder.map(async (chamados) => {
        const { data, semana, ticket, codigo, status, tipo, link } = chamados;

        const result = await sql`
          INSERT INTO chamados (
            data, semana, ticket, codigo, status, tipo, link
          ) VALUES (
            ${data}, ${semana}, ${ticket}, ${codigo}, ${status}, ${tipo}, ${link}
          ) RETURNING *
        `;
        return result[0];
      })
    );

    isSeeded = true;

    return {
      message: "Database seeded successfully",
      chamados: insertChamados,
    };
  } catch (error) {
    console.error(error);
  }
};

"use server";

import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);
// let isSeeded = false;

export async function GET() {
  try {
    const result = await sql`SELECT * FROM chamados`;
    // const count = result[0]?.count || 0;

    const body = { message: "ok" };

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    // Make sure to RETURN the error response
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     const formData = await request.json();

//     console.log("Received Data:", formData);

//     const { ticket, date } = formData;

//     const result = await sql(
//       "INSERT INTO chamados (ticket, data) VALUES (${ticket}, ${date}) RETURNING *"
//     );

//     return NextResponse.json(
//       {
//         message: "Data received successfully",
//         data: result[0],
//       },
//       {
//         status: 201,
//       }
//     );
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         message: "Error processing request",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

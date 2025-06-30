"use server";

import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const result = await sql`SELECT * FROM chamados`;

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

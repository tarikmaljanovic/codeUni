import connection from "@/app/api/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const lesson = await ((await connection).execute(`SELECT * FROM lessons WHERE id = ${params.id}`))

    return NextResponse.json(lesson[0][0])
}
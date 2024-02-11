import connection from "@/app/api/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
        const project = (await (await connection).execute(`SELECT * FROM projects WHERE id = ${params.id}`))[0][0]

        return NextResponse.json(project)
}
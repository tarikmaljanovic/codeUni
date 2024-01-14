import connection from '../../../db';
import { verifyToken } from "../../../jwt";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    const data = await request.json()
    const user = verifyToken(data.token)

    if(user == null) {
        return NextResponse.json({message: 'Invalid Token'})
    }

    const result = (await connection).execute(`UPDATE courses SET deleted = 1 WHERE id = ${params.id}`)

    return NextResponse.json({message: 'Course deleted successfully'});
}
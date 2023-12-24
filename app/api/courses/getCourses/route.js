import connection from '../../db';
import { verifyToken } from "../../jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
    const data = await request.json();
    const user = verifyToken(data.token)

    if(user == null) {
        return NextResponse.json({message: 'Invalid Token'})
    }

    if(user.admin) {
        const result = (await connection).execute(`SELECT * FROM courses`)
        return NextResponse.json((await result)[0])
    } else {
        return NextResponse.json([])
    }

}
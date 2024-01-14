import connection from '../../db';
import { verifyToken } from "../../jwt";
import { NextResponse } from "next/server";

export async function PUT(request) {
    const data = await request.json();
    const user = verifyToken(data.token)

    if(user == null) {
        return NextResponse.json({message: 'Invalid Token'})
    }

    const result = (await connection).execute(`UPDATE courses SET course_title = '${data.course_title}', course_image_url = '${data.course_image_url}' WHERE id = ${data.course_id}`)

    return NextResponse.json({message: 'Course updated successfully'})
}
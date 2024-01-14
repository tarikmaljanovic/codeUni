import connection from '../../db';
import { verifyToken } from "../../jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
    const data = await request.json()

    if(verifyToken((await data).token) == null) {
        return NextResponse.json({message: 'Invalid Token'})
    }

    const lesson = (await connection).execute(`INSERT INTO lessons (lesson_title, lesson_content, course_id) VALUES ('${data.lesson_title}', '[{}]', ${data.course_id})`)

    return NextResponse.json({message: 'Course created sucessfully'})
}
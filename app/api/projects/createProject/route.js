import connection from '../../db';
import { verifyToken } from "../../jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
    const data = await request.json()

    if(verifyToken((await data).token) == null) {
        return NextResponse.json({message: 'Invalid Token'})
    }

    const lesson = (await connection).execute(`INSERT INTO projects (project_title, project_content, course_id) VALUES ('${data.project_title}', '[{}]', ${data.course_id})`)

    return NextResponse.json({message: 'Project created sucessfully'})
}
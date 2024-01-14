import connection from '../../../../db';
import { verifyToken } from "../../../../jwt";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const course = await ((await connection).execute(`SELECT * FROM courses WHERE id = ${params.id}`));
    const user_course = await ((await connection).execute(`SELECT * FROM user_courses WHERE user_id = ${params.userId} AND course_id = ${params.id}`))
    const projects = await ((await connection).execute(`SELECT * FROM projects WHERE course_id = ${params.id}`))
    const lessons = await ((await connection).execute(`SELECT * FROM lessons WHERE course_id = ${params.id}`))

    return NextResponse.json(
        {
            ...course[0][0],
            ...user_course[0][0],
            projects: projects[0],
            lessons: lessons[0]
        }
    )
}
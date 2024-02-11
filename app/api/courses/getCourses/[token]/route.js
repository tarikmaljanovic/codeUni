import connection from "../../../db";
import { verifyToken } from "../../../jwt";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const user = verifyToken(params.token)

    if(user.admin) {
        const result = (await connection).execute(`SELECT * FROM courses`)
        return NextResponse.json((await result)[0])
    } else {
        const result = (await connection).execute(`
            SELECT c.id, c.course_title, c.course_image_url, c.deleted, uc.progress, uc.certificate, uc.starred
            FROM courses c
            LEFT JOIN user_courses uc ON c.id = uc.course_id
            WHERE uc.user_id = ${user.id} OR uc.user_id IS NULL
            ORDER BY uc.progress DESC `);
        
        return NextResponse.json((await result)[0])

    }

}
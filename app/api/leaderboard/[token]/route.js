import connection from '../../db'
import { verifyToken } from '../../jwt'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    const user = verifyToken(params.token)

    if(user == null) {
        return NextResponse.json({message: 'Invalid Token'})
    }

    const result = (await connection).execute(`SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS 'user' , COUNT(DISTINCT ub.badge_id) AS 'badges', COUNT(DISTINCT uc.course_id) AS 'courses'
                                                FROM users u 
                                                JOIN user_badges ub ON ub.user_id = u.id 
                                                JOIN user_courses uc ON uc.user_id = u.id 
                                                WHERE uc.certificate = 1
                                                GROUP BY u.id
                                                ORDER BY 'courses', 'badges' DESC`)
    return NextResponse.json((await result)[0])

}
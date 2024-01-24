import connection from '../../../db';
import { verifyToken } from "../../../jwt";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const user = verifyToken(params.token)
    
    if(user.admin) {
        const result = (await connection).execute(`SELECT * FROM badges`)
        return NextResponse.json((await result)[0])
    } else {
        const result = (await connection).execute(`SELECT *
                                                    FROM badges b 
                                                    JOIN user_badges ub ON b.id = ub.badge_id
                                                    WHERE ub.user_id = ${user.id}
                                                    ORDER BY ub.earning_date DESC`)
        return NextResponse.json((await result)[0])
    }
}
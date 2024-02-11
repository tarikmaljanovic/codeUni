import connection from "../../db";
import { verifyToken } from "../../jwt";
import { NextResponse } from "next/server";

export async function PUT(request) {
    const data = await request.json();

    if (verifyToken(data.token)) {
        try {
            const [result] = await (await connection).execute(
                `UPDATE lessons SET lesson_title = ? WHERE id = ?`,
                [data.lesson_title, data.id]
            );
            
            return NextResponse.json({ message: 'Lesson name updated'});
        } catch (error) {
            return NextResponse.json({ error: 'Error updating lesson name', details: error.message });
        }
    } else {
        return NextResponse.json({ error: 'Invalid token' });
    }
}
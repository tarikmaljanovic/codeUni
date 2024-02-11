import connection from "@/app/api/db";
import { verifyToken } from "@/app/api/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
    const data = await request.json();

    function escapeJsonString(inputString) {
        if (typeof inputString !== 'string') {
            return inputString;
        }
        return JSON.stringify({ content: inputString });
    }

    if (verifyToken(data.token)) {
        const escapedContent = escapeJsonString(data.content);

        try {
            const [result] = await (await connection).execute(
                `UPDATE lessons SET lesson_content = ? WHERE id = ?`,
                [escapedContent, data.id]
            );
            
            return NextResponse.json({ message: 'Lesson updated'});
        } catch (error) {
            return NextResponse.json({ error: 'Error updating lesson', details: error.message });
        }
    } else {
        return NextResponse.json({ error: 'Invalid token' });
    }
}

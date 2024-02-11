import connection from "../../db";
import { NextResponse } from "next/server";
import { verifyToken } from "../../jwt";

export async function PUT(request, { params }) {
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
                `UPDATE projects SET project_content = ? WHERE id = ?`,
                [escapedContent, data.id]
            );
            
            return NextResponse.json({ message: 'Project updated'});
        } catch (error) {
            return NextResponse.json({ error: 'Error updating project', details: error.message });
        }
    }
}
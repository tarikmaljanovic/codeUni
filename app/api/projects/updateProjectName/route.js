import connection from "../../db";
import { verifyToken } from "../../jwt";
import { NextResponse } from "next/server";

export async function PUT(request) {
    const data = await request.json();

    if (verifyToken(data.token)) {
        try {
            const [result] = await (await connection).execute(
                `UPDATE projects SET project_title = ? WHERE id = ?`,
                [data.project_title, data.id]
            );
            
            return NextResponse.json({ message: 'Project name updated'});
        } catch (error) {
            return NextResponse.json({ error: 'Error updating project name', details: error.message });
        }
    } else {
        return NextResponse.json({ error: 'Invalid token' });
    }
}
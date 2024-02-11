import connection from "@/app/api/db";
import { verifyToken } from "@/app/api/jwt";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    const token = params.token
    const id = params.id

    if (verifyToken(token)) {
        try {
            const [result] = await (await connection).execute(
                `DELETE FROM projects WHERE id = ?`,
                [id]
            );
            
            return NextResponse.json({ message: 'Project deleted'});
        } catch (error) {
            return NextResponse.json({ error: 'Error deleting project', details: error.message });
        }
    } else {
        return NextResponse.json({ error: 'Invalid token' });
    }
}
import { NextResponse } from "next/server";
import Jwt  from "jsonwebtoken";

const secret = 'wO4k7kzoHP'

export async function POST(request) {
    const data = await request.json()
    const token = data.token

    try {
        const decode = Jwt.decode(token, secret, {algoright: ['HS256']})
        return NextResponse.json({message: 'valid'})
    } catch(error) {
        return NextResponse.json({message: 'invalid'})
    }
}
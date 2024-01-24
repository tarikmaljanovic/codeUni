import { NextResponse } from "next/server";
import Jwt  from "jsonwebtoken";


const secret = 'wO4k7kzoHP'

export async function GET(request, { params }) {
    const token = params.token

    try {
        const decode = Jwt.decode(token, secret, {algoright: ['HS256']})
        return NextResponse.json({message: 'valid', payload: decode})
    } catch(error) {
        return NextResponse.json({message: 'invalid'}, )
    }
}
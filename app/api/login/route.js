import { NextResponse } from 'next/server';
import { generateToken } from '../jwt';
import connection from '../db';
import CryptoJS from 'crypto-js';

export async function POST(request) {
    const data = await request.json()

    if((await ((await connection).execute(`SELECT email FROM users WHERE email ='${data.email}'`)))[0][0] == undefined) {
        return NextResponse.json({
           message: 'User not found'
        })
    }

    const user = (await ((await connection).execute(`SELECT * FROM users WHERE  email = '${data.email}'`)))[0][0]

   if(CryptoJS.SHA256(data.password).toString() != user.password_hash) {
    return NextResponse.json({message: 'Wrong password'})
   }

   delete user.password_hash

   const token = generateToken(user)

   return NextResponse.json({
    user: user,
    token: token,
    message: 'Successful Login'
   })
}
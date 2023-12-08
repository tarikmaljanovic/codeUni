import { NextResponse } from 'next/server';
import { generateToken } from '../jwt';
import connection from '../db';
import CryptoJS from 'crypto-js';
import express from 'express';

const app = express();
app.use(express.json());

export async function POST(request) {
    const data = await request.json();

    if((await ((await connection).execute(`SELECT email FROM users WHERE email ='${data.email}'`)))[0][0] != undefined) {
        return NextResponse.json({
           message: 'User already exists'
        })
    }

    (await connection).execute(`
        INSERT INTO users (first_name, last_name, email, password_hash)
        VALUES ('${data.firstName}', '${data.lastName}', '${data.email}', '${CryptoJS.SHA256(data.password).toString()}')
    `)

    const user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
    }

    const token = generateToken(user)

    return NextResponse.json({
        user: user,
        token: token,
        message: 'User created successfully'
    })
}
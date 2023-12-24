import connection from '../../db';
import { verifyToken } from "../../jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();

  if(verifyToken((await data).token) == null) {
    return NextResponse.json({message: 'Invalid Token'})
  }

  const course = (await connection).execute(`INSERT INTO courses (course_title, course_image_url) VALUES ('${(await data).course_title}', '${(await data).course_image_url}')`);

  return NextResponse.json({message: 'Course created'});
}
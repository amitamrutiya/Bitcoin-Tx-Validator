import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

export async function GET(): Promise<NextResponse | void> {
  try {
    const files = await readdir("mempool");
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const filePath = path.join("mempool", randomFile);
    const data = await readFile(filePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ error: err });
  }
}

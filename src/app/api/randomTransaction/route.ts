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
    const transaction = JSON.parse(data);
    console.log("Transaction: ", transaction);
    return NextResponse.json(transaction);
  } catch (err) {
    return NextResponse.json({ error: err });
  }
}

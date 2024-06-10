import connectDB from "@/lib/db";
import TransactionModel from "@/model/transaction.model";
import path from "path";
const fs = require("fs").promises;

const directoryPath = path.join(__dirname, "mempool");

async function main() {
  await connectDB();

  try {
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      const data = await fs.readFile(path.join(directoryPath, file), "utf8");
      let jsonData = JSON.parse(data);
      const transaction = new TransactionModel(jsonData);
      // console.log(jsonData);
      await transaction.save();
    }
  } catch (err) {
    console.log("Error:", err);
  }
}

main();

const fs = require("fs");
const path = require("path");

const dirname = "mempool";

fs.readdir(dirname, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
  } else {
    files.forEach((file) => {
      const filePath = path.join(dirname, file);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error(`Error reading file: ${err}`);
        } else {
          const jsonData = JSON.parse(data);
          const hasV1P2tr = jsonData.vin.some(
            (vin) => vin.prevout.scriptpubkey_type === "v1_p2tr"
          );

          if (hasV1P2tr) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file: ${err}`);
              } else {
                console.log(`File ${file} deleted successfully`);
              }
            });
          }
        }
      });
    });
  }
});

const fs = require('fs');

// Step 1: Read Transaction Files
const mempoolPath = './mempool';
const transactions = fs.readdirSync(mempoolPath).map(filename => {
    return JSON.parse(fs.readFileSync(`${mempoolPath}/${filename}`, 'utf8'));
});
console.log(transactions);

// Step 2: Transaction Validation

// Step 3: Block Construction

// Step 4: Mining

// Step 5: Output Generation

// Step 6: Documentation

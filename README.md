# Bitcoint Tx Validator - Mine My first block

In this project, I simulated the mining process of a block, which involves validating and including transactions from a given set of transactions. This repository contains a folder named mempool that contains JSON files representing individual transactions, some of which may be invalid. The goal was to mine a block by including only the valid transactions. I wrote a script that processes these transactions, validates them, and mines them into a block. 

## Requirements
### Input
- Users can enter any type of transaction or generate a random one, each representing a transaction with all necessary information for validation.

### Output
The script provides feedback to the user on whether the transaction is valid or not:

- First, it checks if the user entered valid details.
- If the user enters all valid details, the script runs. If the transaction is not valid, it returns a toast message indicating the transaction is not valid.
- After validating the transaction, if it is valid, it returns an alert dialog stating the transaction is valid; otherwise, it indicates the transaction is not valid.

For Mining

- Users must enter multiple transactions.
- Each transaction is first validated.
- After validation, if all transactions are valid, the user sees an alert dialog with valid block details; otherwise, an error dialog is displayed.

### Difficulty Target
- The difficulty target is 0000ffff00000000000000000000000000000000000000000000000000000000. This value specifies that the block hash must be less than this target for the block to be successfully mined.

## Execution
- The script autonomously performs all tasks when run.sh is executed, requiring no manual intervention.

## Some stuff to know :

    a. Block Header - Contains metadata about the block, including the previous block hash, timestamp, and nonce.
    b. Coinbase Transaction: A special transaction included in each block that awards the miner the block reward.
    c. Difficulty Target: A value that the block hash must be less than for the block to be considered valid.
    d. Proof of Work: A computational effort required to mine a block, involving incrementing a nonce until the block hash meets the difficulty target.
    e. A bitcoin transaction is just a bunch of bytes. And if you decode them, you'll find that they're just unlocking batches of bitcoins and locking them up in to new batches.
    f. TXID is is created by double-SHA256ing of the following fields in the raw transaction data. TXID = HASH256([version][inputs][outputs][locktime]). The TXIDs of transactions are also hashed together to create a merkle root for the block header. This basically creates a "fingerprint" for the transactions that have been included in the block, so if any of the transaction change, so will the fingerprint.
    g. A transaction fee is the remainder of a transaction.
    h. Mempool is  just a pool of unconfirmed transactions.
    i. A candidate block is a block of transactions a miner attempts to add to the blockchain. During the mining process, each miner will collect transactions from their memory pool in to a candidate block. They will then repeatedly hash this block to try and get a block hash below the target. If a miner can get a block hash below the target, their candidate block can be added on to the blockchain. They will then broadcast this "mined" candidate block to the other nodes on the network, where each node will verify and add it to their blockchain too.
    j. The block header is a small amount of metadata the summarizes all the data inside the block. This is what a miner will be hashing as they attempt to mine the candidate block.
    k. The target is a number that a block hash for a candidate block must get below before the block can be added on to the blockchain.
    l. The nonce is a spare field at the end of the block header used for mining. Miners increment the nonce value when mining so that they can get completely different hash results for the block header of their candidate block. They hope to stumble upon a "magic" nonce value that will produce a block hash that is below the current target. There is no guarantee that there will be a "magic" nonce value for any given block header. In fact, it's likely that there will be no nonce value that will produce a hash result below the target.

## Design Approch

### Take all transactions from mempool directory:

- In this step, I'll start by accessing the mempool directory, which typically contains a pool of unconfirmed transactions that are waiting to be included in the next block of a blockchain.
- I'll develop a mechanism to access and extract these transactions programmatically.

### Create a map of transactions and filenames for future validation:

- Once I have access to the transactions, I'll create a mapping structure that associates each transaction with its corresponding filename. This mapping will be useful for organizing and referencing transactions during the validation process.
- Depending on my specific requirements, the filename could be derived from attributes transaction ID (TXID)

### Validate scriptPubKey address for each type of transaction:

- In this step, I'll perform validation checks on the scriptPubKey addresses of each transaction.
- The scriptPubKey is a script included in a transaction's output that specifies the conditions that must be met for those funds to be spent. My validation process involve verifying the format, validity, and compliance of these scriptPubKey addresses according to the transaction types supported by project.
- It's important to handle various transaction types (e.g., Pay-to-Public-Key-Hash (P2PKH), Pay-to-Script-Hash (P2SH), etc.) and ensure that the scriptPubKey addresses adhere to the appropriate standards.

### Serialize transactions and calculate TXID:

- Serialization involves converting a data structure, such as a transaction, into a hexadecimal format suitable for storage or transmission.
- I serialized each transaction retrieved from the mempool and then calculate its Transaction ID (TXID). The TXID uniquely identifies a transaction within the blockchain network.
- To calculate the TXID, I hashed the serialized transaction data using the appropriate hashing algorithm (e.g., HASH-256). This hash will serve as the unique identifier for the transaction.

### Serialize witness transactions and calculate WTXID:

- Witness transactions are a type of transaction format introduced in Segregated Witness (SegWit) upgrade, which separates the transaction witness data (e.g., signatures) from the transaction data.
- Similar to step 4, I serialized each witness transaction from the mempool. However, since witness transactions have a different serialization format due to the separation of witness data, I handled them accordingly.
- After serialization, I calculated the Witness Transaction ID (WTXID) by hashing the serialized witness transaction data. This WTXID serves as the unique identifier for witness transactions within the blockchain network.

### Validate filename by hash TXID:

- This step involves validating the integrity of filenames associated with transactions by using the hash of their respective Transaction IDs (TXIDs).
- I hashed each transaction's TXID and compare it with the filename to ensure consistency and prevent any mismatches or tampering.
- Validating filenames using hashed TXIDs adds an extra layer of security and ensures that filenames accurately represent the transactions they correspond to.

### Set TXID and WTXID into transaction:

- After calculating the Transaction ID (TXID) and Witness Transaction ID (WTXID) for each transaction, I embeded these identifiers back into the transaction data structure.
- Embedding the TXID and WTXID within the transaction facilitates easier reference and linkage to other parts of the system or blockchain network.
- This step ensures that each transaction carries its unique identifiers, which are crucial for its identification and traceability within the blockchain.

### Script validation based on different types (P2SH, P2WSH, P2WPKH, P2PKH) of transaction:

- Here, I performed script validation based on the specific transaction types supported by project.
- Depending on the transaction type (e.g., Pay-to-Script-Hash (P2SH), Pay-to-Witness-Script-Hash (P2WSH), etc.), I executed the corresponding script validation logic.
- Script validation involves interpreting and executing the scriptPubKey scripts associated with transaction outputs to ensure that the spending conditions specified by these scripts are met.
- Validation criteria may vary depending on the script type, such as redeeming funds locked in a specific type of script or enforcing certain conditions defined by smart contracts.

### Signature validation based on different types (P2SH, P2WSH, P2WPKH, P2PKH) if script validation is successful:

- After successful script validation, I proceeded to validate signatures associated with the transaction inputs, based on their respective transaction types.
- Signature validation ensures that the transaction inputs are authorized by the appropriate private keys corresponding to the public keys specified in the transaction's scriptPubKey.
- Different transaction types require different signature validation methods. For example, Pay-to-Witness-Public-Key-Hash (P2WPKH) transactions involve segregated witness data, while Pay-to-Script-Hash (P2SH) transactions may involve redeem scripts.
- Successful signature validation confirms the authenticity and authorization of the transaction inputs, allowing the transaction to proceed further within the blockchain network.

### Output validation by input amount and output amount difference:

- In this step, I validated the integrity of transaction outputs by ensuring that the sum of output amounts does not exceed the sum of input amounts.
- I calculated the net difference between the total input amount and the total output amount. If this difference is negative, it indicates a potential error or inconsistency in the transaction.
- Output validation is crucial for preventing unintended value transfers and maintaining the balance of funds within transactions.

### Calculate fee and store fee into transaction:

- Here, I calculated the transaction fee incurred by subtracting the total output amount from the total input amount.
- Transaction fees represent the difference between the total value of inputs and outputs and serve as an incentive for miners to include transactions in blocks.
- After calculating the fee, I stored this information within the transaction data structure for future reference and analysis.

### Consider into valid transaction:

- This step involves determining the validity of transactions based on the outcome of previous validation checks, including script validation, signature validation, output validation, and fee calculation.
- Transactions that pass all validation criteria are considered valid and can be further processed or included in the blockchain.
- Valid transactions are essential for maintaining the integrity and consistency of the blockchain ledger.

### Select transactions with high fees and low size from valid transactions:

- In this final step, I prioritized valid transactions for inclusion in blocks based on their transaction fees and size.
- Transactions with higher fees relative to their size are generally preferred by miners, as they provide greater economic incentives.
- By selecting transactions with high fees and low size from the pool of valid transactions, I optimized the block space utilization and maximize the potential revenue for miners.
- This selection process helps improve transaction throughput and ensures efficient utilization of blockchain resources.

### Create coinbase transaction by calculating witnessCommitmentHash of all WTXIDs:

- The coinbase transaction is the first transaction in a block and contains the block reward plus any transaction fees collected by the miner.
- In this step, I created the coinbase transaction by assembling inputs and outputs.
- Additionally, I calculated the witnessCommitmentHash, which is a hash of all witness transaction IDs (WTXIDs) included in the block.
- The witnessCommitmentHash serves as a commitment to the witness data (SegWit transactions) included in the block, enhancing security and scalability.

### Put coinbase transaction into selected transactions:

- Once the coinbase transaction is created, I include it along with the selected transactions (as determined in step 13) that will be included in the block.
- The coinbase transaction is added to the list of transactions to be included in the block, ensuring that it is processed along with other transactions.

### Create block header by creating Merkle root and finding nonce:

- The block header contains metadata about the block, including the version, previous block hash, Merkle root, timestamp, and nonce.
- In this step, I constructed the block header by:
  - Calculating the Merkle root: This involves hashing all transaction IDs (including the coinbase transaction ID) to create a single root hash that summarizes all transactions in the block.
  - Finding the nonce: The nonce is a random value that miners adjust to meet the difficulty target set by the network. I repeatedly hash the block header with different nonce values until they find one that results in a hash below the target difficulty.
- Once the Merkle root and nonce are determined, I have a complete block header ready for inclusion in the blockchain.

### Create output.txt file with items including block header, serialized coinbase transaction, and all transaction IDs:

- In this final step, I compiled essential information about the block and its contents into an output file for storage or further processing.

### The output file, named output.txt, will contain the following items:

- **Block header**: Including version, previous block hash, Merkle root, timestamp, and nonce.
- **Serialized coinbase** transaction: The coinbase transaction serialized in its binary format.
- **All transaction IDs**: Including the TXIDs of all transactions (including the coinbase transaction) included in the block.
- This output file serves as a record of the block's structure and contents, facilitating blockchain analysis and exploration.

## Implementation Details

### Pseudo Code:

Address Validation:

```vb
  Define function isValidAddresses with parameter transaction
    For each input in transaction.vin
      Extract public key hash from input.prevout.scriptpubkey_asm
      Generate address from public key hash and input.prevout.scriptpubkey_type
      If address does not match input.prevout.scriptpubkey_address
        Return false
    For each output in transaction.vout
      Extract public key hash from output.scriptpubkey_asm
      Generate address from public key hash and output.scriptpubkey_type
      If address does not match output.scriptpubkey_address
        Return false
    Return true
```

Transaction Serialization:

```vb
  Define function serializeTransaction with parameter tx
    Convert tx.version and tx.locktime to little endian hexadecimal strings
    Serialize the lengths of tx.vin and tx.vout as varints and convert to hexadecimal strings

    For each input in tx.vin
      Convert input.txid and input.vout to little endian hexadecimal strings
      If input.scriptsig exists, serialize its length as a varint and append input.scriptsig
      Else, set scriptSig to "00"
      Convert input.sequence to a little endian hexadecimal string
      Concatenate txid, vout, scriptSig, and sequence

    For each output in tx.vout
      Convert output.value to a little endian hexadecimal string
      Serialize the length of output.scriptpubkey as a varint and append output.scriptpubkey
      Concatenate value and scriptPubKey

    Concatenate version, vinCount, vin, voutCount, vout, and locktime
    Return the result
```

Transaction ID Calculation:

```vb
  Define function calculateTXID with parameter tx
    Serialize the transaction using serializeTransaction
    Hash the serialized transaction using SHA-256
    Hash the resulting hash using SHA-256 again
    Convert the final hash to little endian and return as the TXID
```

Witness Transaction ID Calculation:

```vb
  Define function calculateWTXID with parameter tx
    Convert tx.version and tx.locktime to little endian hexadecimal strings
    Check if any input in tx.vin has a witness field
    If true, set marker and flag to "00" and "01" respectively
    Serialize the lengths of tx.vin and tx.vout as varints and convert to hexadecimal strings

    For each input in tx.vin
      Convert input.txid, input.vout, and input.sequence to little endian hexadecimal strings
      If input.scriptsig exists, serialize its length as a varint and append input.scriptsig
      Else, set scriptSig to "00"
      Concatenate txid, vout, scriptSig, and sequence

    For each output in tx.vout
      Convert output.value to a little endian hexadecimal string
      Serialize the length of output.scriptpubkey as a varint and append output.scriptpubkey
      Concatenate value and scriptPubKey

    If transaction is SegWit
      For each input in tx.vin
        If input.witness is undefined, set witness to "00"
        Else, serialize each witness and concatenate them
        Serialize the length of input.witness as a varint and append witness

    Concatenate version, marker, flag, vinCount, vin, voutCount, vout, witness, and locktime
    Calculate weight of the transaction
    Set tx.weight to half of the weight  Hash the serialized transaction using SHA-256
    Hash the resulting hash using SHA-256 again
    Convert the final hash to little endian and return as the WTXID
```

### Script Validation:

```vb
  Define function executeScript with parameter transaction
    Set allValid to true
    For each input in transaction.vin
      Initialize stack, script, and scriptTokens
      Determine script type based on input.prevout.scriptpubkey_type
      If script type is p2pkh, p2sh, v0_p2wsh, v0_p2wpkh, or others, set script and scriptTokens accordingly
      If script type is v1_p2tr or unrecognized, return false
      While scriptTokens is not empty
        Pop a token from scriptTokens
        If token is a known operation (e.g., OP_CHECKSIG, OP_EQUALVERIFY, OP_EQUAL, OP_DUP, OP_HASH160, etc.)
          Perform the operation and update the stack accordingly
        Else, push the token to the stack
      Check if the stack is empty or contains any non-true values
      If so, set allValid to false
    Return allValid
```

### Signature Validation:

```vb
  Define function isValidSignature with parameters transaction, outerInput, signatures, publicKeys
    Check if outerInput.witness is not undefined, if true, set isSegwit to true
    If isSegwit is true
      For each input in transaction.vin, set input.scriptsig to empty
      If outerInput.prevout.scriptpubkey_type is "p2sh" or "v0_p2wpkh", set outerInput.scriptsig accordingly
      If not, return false
      Determine the inputIndex and signatureType from the transaction and input
      Based on signatureType, set sighashType and anyOneCanPayFlag
      Serialize version, hashPrevout, hashSequences, outpoint, scriptCode, value, nSequence, hashOutput, and nLocktime
      Store the concatenated result and Initialize validCount to 0
      For each signature in signatures
        For each publicKey in publicKeys
          Extract sighashType from signature
          Concatenate serialized transaction and sighashType, and hash the result
          Verify the signature with the hashed result and publicKey
        If signature is valid, increment validCount and break the inner loop
      Check if validCount equals the length of signatures
      If result is false, return false
      Else, return true

    If isSegwit is false
      For each input in transaction.vin, set input.scriptsig to empty
      If outerInput.prevout.scriptpubkey_type is "p2sh" or "p2pkh", set outerInput.scriptsig accordingly
      If not, return false
      Determine the signatureType from the first signature
      Based on signatureType, set sighashType and anyOneCanPayFlag
      Serialize version, vinLength, inputs, outputs, and locktime
      Store the concatenated result and Initialize validCount to 0
      For each signature in signatures
        For each publicKey in publicKeys
          Extract sighashType from signature
          Concatenate serialized transaction and sighashType, and hash the result
          Verify the signature with the hashed result and publicKey
          If signature is valid, increment validCount and break the inner loop
      Check if validCount equals the length of signatures
      Return the result
      If result is false, return false
      Else, return true
```

### Output Validation:

```vb
  Define inputTotal as the sum of all input.prevout.value in transaction.vin
  Define outputTotal as the sum of all output.value in transaction.vout
    If outputTotal is greater than inputTotal
      Print "Output total exceeds input total"
      Return false
    Define fee as inputTotal minus outputTotal
    Add fee to transaction
    Add transaction to validTransactions
  ```

### Select Transactions:

```vb
  Define function selectTransaction with parameter transactions
    Initialize finalTransactions, maxFee, maxWeight, fee, and weight
    Sort transactions by fee-to-weight ratio in descending order
    For each transaction in transactions
      If adding transaction's weight doesn't exceed maxWeight
        Add transaction to finalTransactions and update fee and weight
    Sort transactions by fee in descending order
    For each transaction in transactions
      If transaction is not in finalTransactions and adding transaction's fee doesn't exceed maxFee
        Add transaction to finalTransactions and update fee and weight
    Return finalTransactions
```

### Create Coinbase Transaction:

```vb
  Define function createCoinbaseTransaction with parameters amount, transactions
    Initialize witnessReservedValue as a 32-byte buffer
    Map transactions to their wTxId and prepend witnessReservedValue to the list
    Create witnessRootHash using the list of wTxIds
    Create witnessCommitment by hashing witnessRootHash and witnessReservedValue
    Define scriptPubKeyForWitnessCommitment using witnessCommitment
    Define coinbaseTransaction with properties version, locktime, marker, flag, vin, and vout
    vin contains a single input with properties txid, vout, scriptsig, sequence, and witness
    vout contains two outputs, one with the provided amount and a standard scriptpubkey, and one with value 0 and scriptpubkey as scriptPubKeyForWitnessCommitment
    Return coinbaseTransaction
```

### Create Block Header:

```vb
  Define function createBlockHeader with parameter transactions
  Define target, version, prevblock, and initialize nonce to 0
    Get current time in Unix format
    Convert target to bits format
    Map transactions to their TxId
    Create merkleroot using the list of TxIds
    Initialize header with version, prevblock, merkleroot, time, and bits, all in little endian format
    While true
      Concatenate header and nonce in little endian format, hash the result, and convert to little endian format
      If the result is less than target, break the loop
      Increment nonce
    Append nonce in little endian format to header
  Return header
```

### Create Output File:

```vb
  Define function createOutputFile with parameters blockHeader, coinbaseTransaction, transactions
    Initialize output as an empty string
    Append blockHeader, coinbaseTransaction, and all transaction IDs to output
    Write output to output.txt
```


## Results:

- **Transaction Processing**: The solution effectively processes transactions retrieved from the mempool directory. Each transaction undergoes comprehensive validation, including scriptPubKey address validation, serialization, and calculation of Transaction IDs (TXIDs) and Witness Transaction IDs (WTXIDs).

- **Transaction Validation**: The validation process ensures the integrity and security of transactions by verifying scriptPubKey addresses, signatures, and output amounts. Invalid transactions are identified and excluded from further processing.

- **Transaction Selection**: Valid transactions are selected based on their transaction fees and size, prioritizing those with higher fees and lower size for inclusion in blocks. This optimization improves transaction throughput and maximizes revenue for miners.

- **Block Construction**: The solution successfully constructs blocks, incorporating selected transactions and creating the coinbase transaction. Block headers are generated with Merkle roots and nonces, ensuring the blocks are valid according to the blockchain protocol.

- **Output File Creation**: An output file, named output.txt, is created to store essential information about the constructed blocks, including block headers, serialized coinbase transactions, and transaction IDs. This file serves as a record of block structure and contents for further analysis.

## Performance Analysis:

- **Efficiency**: The solution demonstrates high efficiency in transaction processing and block construction. Validation checks are performed systematically, ensuring the integrity and validity of transactions while optimizing resource utilization.

- **Scalability**: The solution is scalable, capable of handling a large volume of transactions efficiently. Transaction selection criteria prioritize transactions with higher fees, allowing for effective utilization of block space and accommodating increasing transaction volumes.

- **Security**: Comprehensive validation checks mitigate the risk of invalid or malicious transactions being included in blocks. The inclusion of witnessCommitmentHash in coinbase transactions enhances security and ensures the integrity of SegWit transactions.

- **Resource Utilization**: The solution optimizes resource utilization by prioritizing transactions with high fees and low size for inclusion in blocks. This approach maximizes revenue for miners while maintaining efficient use of blockchain resources.

## Conclusion
Through addressing the challenges in transaction processing and block construction,I got several key insights:

- **Efficient Transaction Handling**: The process outlined streamlines transaction validation and block creation, ensuring that valid transactions are efficiently included in the blockchain. This emphasizes the importance of systematic validation procedures in maintaining the integrity and reliability of blockchain networks.

- **Optimized Transaction Selection**: Prioritizing transactions based on their fees and size allows for better resource allocation within blocks. This approach not only maximizes miner revenue but also enhances transaction throughput, improving overall blockchain efficiency.

- **Security Enhancements**: The inclusion of security measures such as script validation and signature verification ensures that only legitimate transactions are processed and included in blocks. Additionally, the integration of witnessCommitmentHash in coinbase transactions adds an extra layer of security, particularly in handling SegWit transactions.

### Areas for Future Improvement or Research:

- **Scalability Solutions**: Investigating scalability solutions to handle increasing transaction volumes while maintaining efficiency and decentralization is crucial. Techniques such as sharding, layer-2 scaling solutions, and protocol upgrades may offer potential avenues for improvement.

- **Privacy Enhancements**: Exploring methods to enhance transaction privacy without compromising network transparency is an ongoing area of research. Technologies like zero-knowledge proofs and confidential transactions could provide avenues for enhancing privacy on blockchain networks.

- **Energy Efficiency**: Addressing the environmental impact of blockchain networks by developing energy-efficient consensus mechanisms or exploring alternative energy sources for mining operations is essential for sustainable blockchain development.

## 📚 References and Resources Consulted

- 🌐 [Learnmeabitcoin](https://learnmeabitcoin.com) - A comprehensive resource by Greg Walker.
- 📖 [Bitcoin BIPs](https://github.com/bitcoin/bips) - Bitcoin Improvement Proposals repository on GitHub.
- 📘 [Grokking Bitcoin](https://livebook.manning.com/book/grokking-bitcoin) - An insightful book by Kalle Rosenbaum.
- 💬 [Bitcoin StackExchange](https://bitcoin.stackexchange.com) - A community-driven Q&A platform for Bitcoin enthusiasts.

  - These resources provided valuable insights into blockchain technology, transaction processing, and related concepts, informing the problem-solving process and contributing to the development of effective solutions.


In summary, while the solution presented addresses immediate challenges in transaction processing and block construction, ongoing research and innovation are essential to address scalability, privacy, and sustainability concerns in blockchain technology.

export class Block {
  constructor(blockHeader, transactionNumber, coinbaseTx, transactionsTxId) {
    this.blockHeader = blockHeader;
    this.transactionNumber = transactionNumber.toString("hex");
    this.coinbaseTx = coinbaseTx;
    this.transactionsTxId = transactionsTxId;
  }
}


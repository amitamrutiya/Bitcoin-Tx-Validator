export class Block {
  blockHeader: string;
  transactionNumber: string;
  coinbaseTx: string;
  transactionsTxId: string[];

  constructor(
    blockHeader: string,
    transactionNumber: Buffer,
    coinbaseTx: string,
    transactionsTxId: string[]
  ) {
    this.blockHeader = blockHeader;
    this.transactionNumber = transactionNumber.toString("hex");
    this.coinbaseTx = coinbaseTx;
    this.transactionsTxId = transactionsTxId;
  }
}

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

export interface TransactionInput {
  txid: string;
  vout: number;
  prevout: TransactionOutput;
  scriptsig: string;
  scriptsig_asm: string;
  witness?: string[];
  is_coinbase: boolean;
  sequence: number;
  inner_redeemscript_asm?: string;
  inner_witnessscript_asm?: string;
}

// Define type for a single output in the transaction
export interface TransactionOutput {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address: string;
  value: number;
}

// Define type for the transaction
export interface Transaction {
  version: number;
  locktime: number;
  vin: TransactionInput[];
  vout: TransactionOutput[];
  fee?: number;
  weight?: number;
  TxId?: string;
  wTxId?: string;
}

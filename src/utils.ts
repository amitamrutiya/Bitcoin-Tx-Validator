import crypto from 'crypto';
import pkg from 'elliptic';
const { ec: EC } = pkg;
const ec = new EC('secp256k1');

export function serializeUInt32LE(value: number): Buffer {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value, 0);
  return buffer;
}

export function hash256Buffer(buffer: Buffer): Buffer {
  const hash1 = crypto.createHash('sha256').update(buffer).digest();
  const hash2 = crypto.createHash('sha256').update(hash1).digest();
  return hash2;
}

export function hash256(data: string): string {
  const binary = Buffer.from(data, 'hex');
  const hash1 = crypto.createHash('sha256').update(binary).digest();
  const hash2 = crypto.createHash('sha256').update(hash1).digest('hex');
  return hash2;
}

export function serializeVarInt(value: number): string | Buffer {
  if (value < 0xfd) {
    return serializeUInt8LE(value);
  } else if (value <= 0xffff) {
    return 'fd' + serializeUInt16LE(value).toString('hex');
  } else if (value <= 0xffffffff) {
    return 'fe' + serializeUInt32LE(value).toString('hex');
  } else {
    return 'ff' + serializeUInt64LE(value).toString('hex');
  }
}

export function serializeUInt16LE(value: number): Buffer {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value, 0);
  return buffer;
}

export function serializeUInt64LE(value: number | bigint): Buffer {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(BigInt(value), 0);
  return buffer;
}

export function serializeUInt8LE(value: number): Buffer {
  const buffer = Buffer.alloc(1);
  buffer.writeUInt8(value, 0);
  return buffer;
}

export function verifySignature(
  transactionDigestHex: string,
  signatureHex: string,
  publicKeyHex: string
): boolean {
  try {
    const signature = Buffer.from(signatureHex.slice(0, -2), 'hex');
    const message = Buffer.from(transactionDigestHex, 'hex');
    const publicKey = ec.keyFromPublic(publicKeyHex, 'hex');
    const result = publicKey.verify(message, signature);
    return result;
  } catch (error) {
    console.log('Error in verifySignature ', signatureHex, publicKeyHex);
    console.log(error);
    return false;
  }
}

export function hash160(str: string): string {
  const hex = sha256(str);
  const res = ripemd(hex);
  return res;
}

function hexStringToBuffer(hexString: string): Uint8Array {
  return new Uint8Array(
    hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
}

function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return new Uint8Array(bytes);
}

function bytesToHex(byteArray: Uint8Array): string {
  return Array.from(byteArray, (byte) =>
    ('0' + (byte & 0xff).toString(16)).slice(-2)
  ).join('');
}

export function sha256(inputHex: string): string {
  const hashBuffer = crypto
    .createHash('sha256')
    .update(hexStringToBuffer(inputHex))
    .digest();
  return bufferToHex(new Uint8Array(hashBuffer));
}

function ripemd(inputHex: string): string {
  const hash = crypto
    .createHash('ripemd160')
    .update(Buffer.from(inputHex, 'hex'))
    .digest();
  return hash.toString('hex');
}

export function calculateTxId(serializedTransaction: string): Buffer {
  const hashResult = crypto
    .createHash('sha256')
    .update(Buffer.from(serializedTransaction, 'hex'))
    .digest();
  const doubleHashResult = crypto
    .createHash('sha256')
    .update(hashResult)
    .digest();

  return Buffer.from(doubleHashResult.reverse());
}

export function createMerkleRoot(txids: string[]): string | null {
  if (txids.length === 0) return null;

  let level = txids.map((txid) =>
    Buffer.from(txid, 'hex').reverse().toString('hex')
  );

  while (level.length > 1) {
    const nextLevel: string[] = [];

    for (let i = 0; i < level.length; i += 2) {
      let pairHash;
      if (i + 1 === level.length) {
        pairHash = hash256(level[i] + level[i]);
      } else {
        pairHash = hash256(level[i] + level[i + 1]);
      }
      nextLevel.push(pairHash);
    }

    level = nextLevel;
  }

  return level[0];
}

export function toLittleEndian(hex: string): string {
  return Buffer.from(hex, 'hex').reverse().toString('hex');
}

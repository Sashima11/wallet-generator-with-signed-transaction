const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

// exports.signTransfer = (msg, pk) => {
//     const signed = secp.secp256k1.sign(msg, pk, { recovery: true });
//     console.log(`Signiture: ${signed[0]}`, `RecoveryBit: ${signed[1]}`);
//     console.log(signed);
//     return signed;
// };

const privateKey = secp.secp256k1.utils.randomPrivateKey();
console.log("Private Key:", toHex(privateKey));

const publicKey = secp.secp256k1.getPublicKey(privateKey);
console.log("Public Key: ", toHex(publicKey));

const address = keccak256(publicKey.slice(1)).slice(-20);
console.log("Address: ", toHex(address));

const wallet = [toHex(privateKey), toHex(address)];
console.log('Wallet PK and Address:', wallet);

const hashed = keccak256(utf8ToBytes("Message to hash"));
const signiture = secp.secp256k1.sign(hashed, privateKey, { recovery: true });
console.log("Signiture: ", signiture);
console.log("Signiture: ", signiture.recovery);

const pub = secp.secp256k1.getPublicKey(hashed, signiture, signiture.recovery);
console.log("Public key recovered: ", toHex(pub));

const v = secp.secp256k1.verify(signiture, hashed, publicKey);
console.log("Verification: ", v);

const hashedT = keccak256(utf8ToBytes("Message to hashh"));
const vt = secp.secp256k1.verify(signiture, hashedT, publicKey);
console.log("Verification: ", vt);
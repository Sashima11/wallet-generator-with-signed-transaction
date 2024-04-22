const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

exports.generate = () => {
    const privateKey = secp.secp256k1.utils.randomPrivateKey();
    //console.log("Private Key:", toHex(privateKey));

    const publicKey = secp.secp256k1.getPublicKey(privateKey);
    console.log("Public Key: ", toHex(publicKey));
    
    const wallet = [privateKey, publicKey];
    console.log('Wallet PK and Address:', wallet);
    return wallet;    

}


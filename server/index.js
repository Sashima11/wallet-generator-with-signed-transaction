const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const generate = require("./script/generate");
//const signTransfer = require("./script/sign");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");


app.use(cors());
app.use(express.json());

let addressToPrivateKey = {
  "address": "private key",
}
let addressToPublicKey = {
  "address": "public key",
};
let pcodes = {
  "address": "passcode",
}

let signitures = {
  "publicKey": "signiture",
}

let pubKeySig = {
  "pubSig": "publicKey"
}

let balances = {
  "02bdac721fdebd2f99b09a1f9008bebc18b9fbcfbff82cf6d79f9ba44ff09e6907": 150,
  "0289b95d7231256e5da1bd55ae9536813812407402e3fca2f04600b1b9eb955233": 100,
  "024d44532b421468611c5cfbcab24505b6f1e44e081af198987e30f9863b05b4a7": 50,
  "031ba600bf7d5a2153e8a4b07b552465cac5f7938f72d4bdf96108ac274d672599": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, amount, pubSig, recipient } = req.body;

  if (signitures[pubSig] == undefined) {
    res.status(400).send({ message: "INVALID SIGNITURE!" });
  }
  if (sender == undefined) {
    res.status(400).send({ message: "INVALID SENDER!" });
  }
  if (recipient == undefined) {
    res.status(400).send({ message: "INVALID RECIVER!" });
  }
  if (addressToPublicKey[sender] == undefined) {
    res.status(400).send({ message: "SENDER NOT REGISTERED" });
  }

  //hash message
  const msg = toHex(keccak256(utf8ToBytes(`${sender}${amount}${recipient}`)));

  //verify signiture
  const v = secp.secp256k1.verify(
    signitures[pubSig],
    msg,
    addressToPublicKey[sender]
  );

  if (v) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      delete signitures[pubSig];
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "INVALID SIGNITURE" });
  }
});

app.post("/sign", (req, res) => {
  console.log("I reacted");

  const { sender, password, amount, recipient } = req.body;
  console.log(sender, password);
  console.log(pcodes[sender]);
  if (password === pcodes[sender]) {
    // hash message
    const hashed = keccak256(utf8ToBytes(`${sender}${amount}${recipient}`));

    //get private key from address
    const pk = addressToPrivateKey[sender];
    //get signiture
    const signiture = secp.secp256k1.sign(hashed, pk, { recovery: true });
    console.log("Signiture:", signiture.r);
    console.log("Signiture:", signiture.s);
    console.log("Signiture:", signiture.recovery);
    const pub = secp.secp256k1.getPublicKey(hashed, signiture, signiture.recovery);
    const sig = toHex(pub);
    signitures[sig] = signiture;

    if (sig != undefined) {
      res.send({ sig });
      console.log({ sig });
    } else {
      res.status(400).send({ message: "Something went wrong!" });
    }
      
  } 

});

app.post("/gen/:password", (req, res) => {
  const { password } = req.params;
  const w = generate.generate();
  const address = keccak256(w[1].slice(1)).slice(-20);
  const wallet = [toHex(w[0]), toHex(address)]

  addressToPrivateKey[wallet[1]] = w[0];
  addressToPublicKey[wallet[1]] = w[1];

  balances[wallet[1]] = 100;
  pcodes[wallet[1]] = password;
  
  console.log("Address and Private Key:", wallet);
  console.log("Password:", pcodes);
  console.log("Balances:", balances);


  if (wallet[0] != 0) {
    res.send({ wallet });
    console.log(wallet);
  } else {
    res.status(400).send({ message: "Something went wrong!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

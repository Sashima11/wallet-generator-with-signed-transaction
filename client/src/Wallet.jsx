import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { useState } from "react";

function Wallet({ address, setAddress, balance, setBalance, wallet, setWallet }) {
  const [password, setPassword] = useState("");

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  const onGenerate = param => async (evt) => {
    evt.preventDefault();
    const pass = param;
    console.log(pass);

    if (pass != "") {
      try {
        const {
          data: { wallet },
        } = await server.post(`gen/${pass}`);
        setWallet(wallet);
        alert(
          `This is your private key shown only once, please store it safely: ${wallet[0]}`
        );
      } catch (ex) {
        alert(ex.response.data.message);
      }
    }
  }

  return (
    <div className="container wallet">
      <h1>Wallet</h1>

      <form onSubmit={onGenerate(password)}>
        <label>
          <h3>Password:</h3>
          <input
            type="password"
            placeholder="Type in your password"
            value={password}
            onChange={(e) => {setPassword(e.target.value);}}
          ></input>
        </label>
        <input type="submit" className="button" value="Generate" />
        <div className="divider"></div>
        <div>Address: {wallet[1]}</div>
        {/* <div>Address: {wallet}</div> */}
      </form>

      <label>
        <input
          placeholder="Type your address:"
          value={address}
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

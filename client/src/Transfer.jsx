import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [password, setPassword] = useState("");
  const [sig, setSig] = useState("");
  const [sigT, setSigT] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        pubSig: sigT,
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  const signTransaction = param => async (evt) => {
    evt.preventDefault();
    const pass = param;
    console.log(sendAmount)

    try {
      const { data: { sig } } = await server.post(`sign`, { sender: address, password: pass, amount: sendAmount, recipient, });
      setSig(sig);
      alert(`This is your signiture for this transaction: ${sig}`);
    } catch {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Transfer</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={(e) => {
            setSendAmount(e.target.value);
          }}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input
        type="password"
        placeholder="Signiture"
        value={sigT}
        onChange={(e) => {
          setSigT(e.target.value);
        }}
      />

      <label>
        <h3>Password:</h3>
        <input
          type="password"
          placeholder="Type in your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
      </label>

      <input
        type="button"
        className="button"
        value="Sign transaction"
        onClick={signTransaction(password)}
      />

      

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

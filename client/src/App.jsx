import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [wallet, setWallet] = useState("");
  //const [password, setPassword] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        wallet={wallet}
        setWallet={setWallet}
      />
      <Transfer setBalance={setBalance} address={address} />
    </div>
  );
}

export default App;

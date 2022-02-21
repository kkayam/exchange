import React, { useState, useEffect } from "react";

import styled from "styled-components";
import {
  Window,
  WindowContent,
  WindowHeader,
  Button,
  Toolbar,
  Avatar,
  Fieldset,
  TextField,
  LoadingIndicator,
} from "react95";

import Web3 from "web3";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  ERC20_ABI,
} from "../smart_contract/config";

const validAvalancheChain = "0XA869";

const Wrapper = styled.div`
  padding: 5rem;
  background: ___CSS_0___;
  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: "";
      position: absolute;
      background: ___CSS_1___;
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .window {
    width: 600px;
    min-height: 400px;
  }
  .window:nth-child(2) {
    margin: 2rem;
  }
  .footer {
    display: block;
    margin: 0.25rem;
    height: 31px;
    line-height: 31px;
    padding-left: 0.25rem;
  }
  input {
    padding: 15px;
    font-size: 3rem;
  }
`;
export function SwapWindow() {
  const [status, setStatus] = useState({
    connected: false,
    status: "Connect wallet",
    address: "",
  });

  const [exchange, setExchange] = useState();
  const [sellAmount, setSellAmount] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);
  const [swapMode, setSwapMode] = useState(0);
  const [ERC20, setERC20] = useState(0);
  const [tokens, setTokens] = useState(["AVAX", ""]);
  const [ERC20_DECIMALS, setERC20_DECIMALS] = useState(0);

  const web3 = new Web3(window.ethereum);

  const connectWallet = async () => {
    try {
      const accounts = await web3.eth.requestAccounts().then(fa);
      setStatus({
        connected: true,
        status: "",
        address: accounts[0],
      });
    } catch (error) {
      setStatus({
        connected: false,
        status: "Connect wallet",
        address: "",
      });
    }
    try {
      if (!(validAvalancheChain === window.ethereum.chainId.toUpperCase())) {
        var s = status;
        s.connected = false;
        s.status = "Switch to Avax Testnet";
        setStatus(s);
        const response = await web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: validAvalancheChain }],
        });
        if (!response.code) {
          s.connected = true;
          s.status = "";
          setStatus(s);
        }
      }
    } catch (error) {}

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
    const exchange = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    setExchange(exchange);
    exchange.methods
      .tokenAddress()
      .call()
      .then((ERC20_ADDRESS) => {
        const ERC20 = new web3.eth.Contract(ERC20_ABI, ERC20_ADDRESS);
        setERC20(ERC20);
        ERC20.methods
          .name()
          .call()
          .then((ERC20_name) => {
            setTokens(["AVAX", ERC20_name]);
          });
        ERC20.methods
          .decimals()
          .call()
          .then((ERC20_decimals) => {
            setERC20_DECIMALS(ERC20_decimals);
          });
      });
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    getBuyAmount();
  }, [sellAmount, swapMode]);

  function decimalsToERC20(decimal_it) {
    return parseInt(decimal_it) / 10 ** ERC20_DECIMALS;
  }
  function ERC20ToDecimals(n) {
    return parseInt(n) * 10 ** ERC20_DECIMALS;
  }

  async function swap() {
    var s = status;
    try {
      if (!swapMode) {
        s.status = "loading";
        setStatus(s);
        exchange.methods
          .ethToTokenSwap(0)
          .send({
            from: status.address,
            gas: 470000,
            value: sellAmount, // in WEI, which is equivalent to 1 ether
          })
          .then(() => {
            s = status;
            s.status = "";
            setStatus(s);
          });
      } else {
        s.status = "loading";
        setStatus(s);
        ERC20.methods
          .approve(CONTRACT_ADDRESS, sellAmount)
          .send({ from: status.address })
          .then(() => {
            exchange.methods
              .tokenToEthSwap(sellAmount, 0)
              .send({ from: status.address })
              .then(() => {
                s = status;
                s.status = "";
                setStatus(s);
              });
          });
      }
    } catch (e) {
      s = status;
      s.status = "";
      setStatus(s);
    }
  }

  const getBuyAmount = async () => {
    if (!swapMode) {
      exchange.methods
        .getTokenAmount(sellAmount)
        .call()
        .then((buyAmount) => {
          setBuyAmount(decimalsToERC20(buyAmount));
        });
    } else {
      exchange.methods
        .getEthAmount(sellAmount)
        .call()
        .then((buyAmount) => {
          setBuyAmount(web3.utils.fromWei(buyAmount, "ether"));
        });
    }
  };

  const inputChange = (e) => {
    if (!swapMode) {
      setSellAmount(Web3.utils.toWei(e.target.value, "ether"));
    } else {
      setSellAmount(ERC20ToDecimals(e.target.value));
    }
  };

  const toggleSwapMode = (e) => {
    setSwapMode(1 - swapMode);
  };

  return (
    <Wrapper>
      <Window className="window">
        <WindowHeader className="window-header">
          <span>exchange.exe</span>
          <Button>X</Button>
        </WindowHeader>
        <Toolbar>
          <Button variant="menu" size="sm">
            Settings
          </Button>
          <Button variant="menu" size="sm">
            Wallet
          </Button>
        </Toolbar>
        <WindowContent>
          <Fieldset label="Swap">
            <div>
              <TextField fullWidth defaultValue={0} onChange={inputChange} />

              <Button
                style={{
                  position: "absolute",
                  "z-index": "500",
                  "margin-top": "-65px",
                  right: "40px",
                  "font-size": "1.2rem",
                  padding: "10px",
                }}
              >
                {tokens[swapMode]}
              </Button>
              <Avatar
                size={50}
                style={{
                  "z-index": "500",
                  "font-size": "2rem",
                  position: "absolute",
                  "margin-left": "auto",
                  "margin-right": "auto",
                  left: "0",
                  right: "0",
                  "margin-top": "-10px",
                  cursor: "pointer",
                }}
                onClick={toggleSwapMode}
              >
                ▼
              </Avatar>
            </div>
            <br />
            <div>
              <TextField value={buyAmount} disabled fullWidth />
              <Button
                style={{
                  position: "absolute",
                  "z-index": "500",
                  "margin-top": "-65px",
                  right: "40px",
                  "font-size": "1.2rem",
                  padding: "10px",
                }}
              >
                {tokens[1 - swapMode]}
              </Button>
            </div>
            <br />
            {!status.connected ? (
              <Button
                style={{ height: "60px", "font-size": "1.5rem" }}
                onClick={connectWallet}
                fullWidth
              >
                {status.status}
              </Button>
            ) : status.status === "loading" ? (
              <>
                <p> Loading... </p>
                <LoadingIndicator />
              </>
            ) : (
              <Button
                style={{ height: "60px", "font-size": "1.5rem" }}
                onClick={swap}
                fullWidth
              >
                Swap
              </Button>
            )}
          </Fieldset>
        </WindowContent>
      </Window>
    </Wrapper>
  );
}

SwapWindow.story = {
  name: "default",
};

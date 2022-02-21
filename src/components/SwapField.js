import React, { useState, useEffect } from "react";

import Web3 from "web3";
import { Button, Avatar, TextField, Fieldset } from "react95";

export function SwapField(props) {
  const [sellAmount, setSellAmount] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);
  const [swapMode, setSwapMode] = useState(0);
  const [costInfo, setCostInfo] = useState();

  useEffect(() => {
    if (sellAmount > 0) {
      getBuyAmount();
    } else {
      setBuyAmount("0");
    }
  }, [sellAmount, swapMode]); // eslint-disable-line react-hooks/exhaustive-deps

  function decimalsToERC20(decimal_it) {
    return parseInt(decimal_it) / 10 ** props.ERC20_DECIMALS;
  }
  function ERC20ToDecimals(n) {
    return parseInt(n) * 10 ** props.ERC20_DECIMALS;
  }

  async function swap() {
    var s = { ...props.status };
    s.status = "loading";
    props.setStatus(s);
    if (!swapMode) {
      props.exchange.methods
        .ethToTokenSwap(0)
        .send({
          from: props.status.address,
          gas: 470000,
          value: sellAmount, // in WEI, which is equivalent to 1 ether
        })
        .then(() => {
          s = { ...props.status };
          s.status = "";
          props.setStatus(s);
          getBuyAmount();
        })
        .catch((e) => {
          s = { ...props.status };
          s.status = "";
          props.setStatus(s);
          getBuyAmount();
        });
    } else {
      props.ERC20.methods
        .approve(props.CONTRACT_ADDRESS, sellAmount)
        .send({ from: props.status.address })
        .then(() => {
          props.exchange.methods
            .tokenToEthSwap(sellAmount, 0)
            .send({ from: props.status.address })
            .then(() => {
              s = { ...props.status };
              s.status = "";
              props.setStatus(s);
              getBuyAmount();
            })
            .catch((e) => {
              s = { ...props.status };
              s.status = "";
              props.setStatus(s);
              getBuyAmount();
            });
        });
    }
  }

  const getBuyAmount = async () => {
    if (!swapMode) {
      props.exchange.methods
        .getTokenAmount(sellAmount)
        .call()
        .then((_buyAmount) => {
          setBuyAmount(decimalsToERC20(_buyAmount));
          props.exchange.methods
            .ethToTokenSwap(0)
            .estimateGas({ from: props.status.address })
            .then((gasEstimate) => {
              setCostInfo({
                price:
                  props.web3.utils.fromWei(sellAmount, "ether") /
                  decimalsToERC20(_buyAmount),
                gas: gasEstimate,
              });
            });
        });
    } else {
      props.exchange.methods
        .getEthAmount(sellAmount)
        .call()
        .then((_buyAmount) => {
          setBuyAmount(props.web3.utils.fromWei(_buyAmount, "ether"));
          props.exchange.methods
            .tokenToEthSwap(sellAmount, 0)
            .estimateGas({ from: props.status.address })
            .then((gasEstimate) => {
              setCostInfo({
                price:
                  decimalsToERC20(sellAmount) /
                  props.web3.utils.fromWei(_buyAmount, "ether"),
                gas: gasEstimate,
              });
            });
        });
    }
  };

  const inputChange = (e) => {
    if (e.target.value === "" || parseInt(e.target.value) === 0) {
      setCostInfo("");
      setSellAmount("0");
    } else {
      if (!swapMode) {
        setSellAmount(Web3.utils.toWei(e.target.value, "ether"));
      } else {
        setSellAmount(ERC20ToDecimals(e.target.value));
      }
    }
  };

  const toggleSwapMode = (e) => {
    setSwapMode(1 - swapMode);
  };

  return (
    <>
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
          {props.tokens[swapMode]}
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
          {props.tokens[1 - swapMode]}
        </Button>
      </div>
      <br />
      {!props.status.connected ? (
        <Button
          style={{ height: "60px", "font-size": "1.5rem" }}
          onClick={props.connectWallet}
          fullWidth
        >
          {props.status.status}
        </Button>
      ) : props.status.status === "loading" ? (
        <>
          <Button
            style={{ height: "60px", "font-size": "1.5rem" }}
            onClick={swap}
            fullWidth
            disabled
          >
            {/* <LoadingIndicator /> */}
            Swap in progress...
          </Button>
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
      {props.status.connected && costInfo ? (
        <>
          <br />
          <br />
          <Fieldset label="cost info">
            <p>Price: {costInfo.price}</p>
            <p>Gas estimate: {costInfo.gas}</p>
          </Fieldset>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

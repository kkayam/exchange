import React, { useState, useEffect } from "react";

import {
  Tabs,
  Tab,
  TabBody,
  Window,
  WindowContent,
  WindowHeader,
  Button,
  Toolbar,
} from "react95";

import Web3 from "web3";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  ERC20_ABI,
} from "../smart_contract/config";

import { Wrapper } from "./windowWrapper";
import { SwapField } from "./SwapField";

const validAvalancheChain = "0XA869";

export function ExchangeWindow() {
  const [status, setStatus] = useState({
    connected: false,
    status: "Connect wallet",
    address: "",
  });

  const [activeTab, setActiveTab] = useState(0);
  const [exchange, setExchange] = useState();
  const [ERC20, setERC20] = useState(0);
  const [tokens, setTokens] = useState(["AVAX", ""]);
  const [ERC20_DECIMALS, setERC20_DECIMALS] = useState(0);

  const web3 = new Web3(window.ethereum);

  const connectWallet = async () => {
    web3.eth
      .requestAccounts()
      .then((accounts) => {
        setStatus({
          connected: true,
          status: "",
          address: accounts[0],
        });
      })
      .catch((e) => {
        setStatus({
          connected: false,
          status: "Connect wallet",
          address: "",
        });
      })
      .then(() => {
        if (!(validAvalancheChain === window.ethereum.chainId.toUpperCase())) {
          var s = status;
          s.connected = false;
          s.status = "Switch to Avax Testnet";
          setStatus(s);
          web3.currentProvider
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: validAvalancheChain }],
            })
            .then((response) => {
              if (!response.code) {
                s.connected = true;
                s.status = "";
                setStatus(s);
              }
            });
        }
      });

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  };

  const getExchange = async () => {
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
    getExchange();
  }, []);

  const handleChangeTabs = (e, value) => setActiveTab(value);

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
          <Tabs value={activeTab} onChange={handleChangeTabs}>
            <Tab value={0}>Swap</Tab>
            <Tab value={1}>Pool</Tab>
          </Tabs>
          <TabBody style={{ minHeight: "350px" }}>
            {activeTab === 0 && (
              <SwapField
                ERC20_DECIMALS={ERC20_DECIMALS}
                status={status}
                setStatus={setStatus}
                exchange={exchange}
                ERC20={ERC20}
                CONTRACT_ADDRESS={CONTRACT_ADDRESS}
                connectWallet={connectWallet}
                web3={web3}
                tokens={tokens}
              />
            )}
            {activeTab === 1 && (
              <div>
                <div>Coming soon!</div>
              </div>
            )}
          </TabBody>
        </WindowContent>
      </Window>
    </Wrapper>
  );
}

ExchangeWindow.story = {
  name: "default",
};

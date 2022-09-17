import React from "react";
import NavButton from "./navButton";
import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import {
  useAddress,
  useMetamask,
  useDisconnect,
  useNetworkMismatch,
  useNetwork,
  useChainId,
  ChainId,
  ConnectWallet,
  useBalance,
} from "@thirdweb-dev/react";
import network from "../network";
import { ethers } from "ethers";
import { useEffect } from "react";
import currency from "../constants";

function Header() {
  const connectWithMetamask = useMetamask();
  const address = useAddress(); // get connected wallet address
  const disconnect = useDisconnect();
  const isMismatched = useNetworkMismatch(); // switch to desired chain
  const [, switchNetwork] = useNetwork(); // detect id user is connected to the wrong network

  const balance = useBalance();
  console.log(`here is your balance ${balance.data?.displayValue}`);
  const displayBalance = balance.data?.displayValue;

  //   useEffect(() => {
  //     // check if the user is connected to the wrong address
  //     if (isMismatched) {
  //       // prompt their wallet to switch networks
  //       switchNetwork(ChainId.Rinkeby);
  //     }
  //   }, [address]); // runs every time "address" changes

  useEffect(() => {
    networkCheck();
  }, [address]);

  async function networkCheck() {
    if (isMismatched) {
      // prompt their wallet to switch networks
      switchNetwork(ChainId.Rinkeby);
    }
  }
  return (
    <header className="grid grid-cols-2 md:grid-cols-5">
      <div className="flex items-center space-x-2">
        <img
          className="rounded-full h-20 w-20"
          src="https://i0.wp.com/bulls-world.com/wp-content/uploads/2022/07/maddog-pfp.jpg.png?fit=647%2C655&ssl=1"
          alt="profile-image"
        ></img>
        {/* <div>
          <h1 className="text-lg text-white font-bold">A Lottery</h1>
            <p className="text-xs text-emerald-500 truncate">User...{address?.substring(0, 5)}...{address?.substring(address.length, address.length - 5)} </p>
        </div> */}
        <div>
          <h1 className="text-lg text-white font-bold">A Lottery</h1>
          <div className="text-xs text-emerald-500 truncate">
            {address ? (
              <h4>
                Connected as {address?.substring(0, 5)}...
                {address?.substring(address.length, address.length - 5)}
                <p>{displayBalance?.substring(0,5)}{currency}</p>
              </h4>
            ) : (
              <button onClick={connectWithMetamask}>
                Connect Metamask Wallet
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="hidden md:flex md:col-span-3 items-center justify-center rounded-md">
        <div className="bg-[#0A1F1C] p-4 space-x-2">
          <NavButton isActive title="Buy Tickets"></NavButton>
          <NavButton onClick={disconnect} title="LogOut"></NavButton>
          {/* <br></br>
          <p className="text-white">Make sure you are on the {network} chain</p> */}
          {/* <ConnectWallet accentColor="#f213a4" colorMode="dark" ></ConnectWallet> */}
        </div>
      </div>

      <div className="flex flex-col ml-auto text-right">
        <Bars3BottomRightIcon className="h-8 w-8 mx-auto text-white cursor-pointer"></Bars3BottomRightIcon>
        <span className="md:hidden">
          <NavButton onClick={disconnect} title="LogOut"></NavButton>
        </span>
      </div>
    </header>
  );
}

export default Header;

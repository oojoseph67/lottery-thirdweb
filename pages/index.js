import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import Login from "../components/login";
import {
  useContract,
  useMetamask,
  useDisconnect,
  useAddress,
  useContractData,
  useContractCall,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import Loading from "../components/loading";
import currency from "../constants";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CountdownTimer from "../components/countdownTimer";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControls from "../components/adminControls";
import Footer from "../components/footer";

export default function Home() {
  const [userTickets, setUserTickets] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const address = useAddress(); // get connected wallet address
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );

  const { data: remainingTickets } = useContractRead(contract,"RemainingTickets");
  const { data: pricePool } = useContractRead(contract, "CurrentWinningReward");

  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");
  const { data: ticketCommission } = useContractRead(contract, "ticketCommission");
  
  const { data: expiration } = useContractRead(contract, "expiration");

  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets");
  const { data: tickets } = useContractRead(contract, "getTickets");
  
  const { data: winnings } = useContractRead(contract, "getWinningsForAddress", address)
  const { mutateAsync: withdrawWinnings } = useContractWrite(contract, "WithdrawWinnings")

  const { data: lastWinner } = useContractRead(contract, "lastWinner")
  const { data: lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount")

  const { data: isLotteryOperator } = useContractRead(contract, "lotteryOperator")

  useEffect(() => {
    if (!tickets) return;

    const totalTickets = tickets;
    // console.log(`bitch ${totalTickets}`)
    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );
    // console.log(`bitch ${noOfUserTickets}`);
    setUserTickets(noOfUserTickets);
  }, [tickets, address]);

  console.log(userTickets);
  console.log(address);

  // buying ticket function
  const handleClick = async () => {
    if (!ticketPrice) return;
    const notification = toast.loading("Buying your tickets");
    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      ]);

      toast.success("Tickets purchased successfully", {
        id: notification,
      });
      console.info("contract call success", data);
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
      console.info("contract call failure", err);
    }
  };

  // withdrawing commission function
  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Withdrawing winnings...");
    try {
      const data = await withdrawWinnings([{}]);

      toast.success("Winnings withdraw successfully!", {
        id: notification,
      });
    } catch (err) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
      console.error("contract call failure", err);
    }
  };

  if (isLoading) return <Loading></Loading>;
  if (!address) return <Login></Login>;

  return (
    <div className="bg-emerald-900 min-h-screen flex flex-col">
      {/* header */}
      <Header></Header>

      <br></br>

      {/* slider for last-winner */}
      <Marquee className="bg-[#0A1F1C] p-5 mb-5" gradient={false} speed={100}>
        <div className="flex space-x-2 mx-18">
          <h4 className="text-white font-bold">
            {/* Last Winner: {lastWinner?.toString()} */}
            Last Winner: {lastWinner?.substring(0, 5)}...{lastWinner?.substring(lastWinner.length, lastWinner.length - 5)}
          </h4>
          <h4 className="text-white font-bold">
            Previous Winnings:{" "}
            {lastWinnerAmount &&
              ethers.utils.formatEther(lastWinnerAmount.toString())}{" "}
            {currency}
          </h4>
        </div>
      </Marquee>
      
      {/* admin controls */}
      {isLotteryOperator === address && (
        <div className="flex justify-center">
          <AdminControls></AdminControls>
        </div>
      )}

      {/* withdraw proceeds notification */}
      {winnings > 0 && (
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
          <button
            onClick={onWithdrawWinnings}
            className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full"
          >
            <p className="font-bold">Winner Winner Chicken Dinner!</p>
            <p>
              Total Winnings: {ethers.utils.formatEther(winnings.toString())}{" "}
              {currency}
            </p>
            <br></br>
            <p className="font-semibold">Click here to withdraw</p>
          </button>
        </div>
      )}

      {/* the next draw box */}
      <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
        <div className="stats-container">
          <h1 className="text-5xl text-white font-semibold text-center">
            The Next Draw
          </h1>
          <div className="flex justify-between p-2 space-x-2">
            {/* total pool */}
            <div className="stats">
              <h2 className="text-sm">Total Pool</h2>
              <p className="text-xl">
                {pricePool && ethers.utils.formatEther(pricePool.toString())}{" "}
                {""} {currency}
              </p>
            </div>
            {/* tickets remaining */}
            <div className="stats">
              <h2 className="text-sm">Tickets Remaining</h2>
              <p className="text-xl">{remainingTickets?.toNumber()}</p>
            </div>
          </div>
          {/* countdown timer */}
          <div className="mt-5 mb-3">
            <CountdownTimer></CountdownTimer>
          </div>
        </div>

        {/* price per tickets */}
        <div className="stats-container space-y-2">
          <div className="stats-container">
            <div className="flex justify-between items-center text-white pb-2">
              <h2>Price per ticket</h2>
              <p>
                {ticketPrice &&
                  ethers.utils.formatEther(ticketPrice.toString())}{" "}
                {""} {currency}
              </p>
            </div>
            <div className="flex text-white items-center space-x-2 bg-[#091B1B] border-[#004337] border p-4">
              <p>TICKETS</p>
              <input
                className="flex w-full bg-transparent text-right outline-none"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              ></input>
            </div>
            <div className="space-y-2 mt-5">
              <div className="flex items-center justify-between text-emerald-300 text-s italic font-extrabold">
                <p>Total cost </p>
                <p>
                  {ticketPrice &&
                    Number(ethers.utils.formatEther(ticketPrice.toString())) *
                      quantity}{" "}
                  {currency}
                </p>
              </div>

              {/* <div className="flex items-center justify-between text-emerald-300 text-s italic font-extrabold">
                <p>Service Fees</p>
                <p>
                  {ticketCommission &&
                    ethers.utils.formatEther(ticketCommission.toString())}{" "}
                  {""} {currency}
                </p>
              </div> */}

              {/* <div className="flex items-center justify-between text-emerald-300 text-s italic font-extrabold">
                <p>+ Network Fees</p>
                <p>TBC</p>
              </div> */}
            </div>
            <button
              onClick={handleClick}
              disabled={
                expiration?.toString() < Date.now().toString() ||
                remainingTickets?.toNumber() == 0
              }
              className="font-semibold mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl disabled:text-gray-100 disabled:from-gray-600 disabled:to-gray-100 disabled:cursor-not-allowed"
            >
              Buy {quantity} Tickets for{" "}
              {ticketPrice &&
                Number(ethers.utils.formatEther(ticketPrice.toString())) *
                  quantity}{" "}
              {currency}
            </button>
          </div>

          {/* number of tickets owned by the user */}
          {userTickets > 0 && (
            <div className="stats">
              <p className="text-lg mb-2">
                You have {userTickets} Tickets in this draw
              </p>
              <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                {Array(userTickets)
                  .fill("")
                  .map((_, index) => (
                    <p
                      key={index}
                      className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                    >
                      {index + 1}
                    </p>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <Footer></Footer> */}
    </div>
  );
}

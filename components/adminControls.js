import React from "react";
import { StarIcon, CurrencyDollarIcon, ArrowPathIcon, ArrowUturnDownIcon } from "@heroicons/react/24/solid"
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
import currency from "../constants";
import { ethers } from "ethers"
import toast from "react-hot-toast";

function AdminControls() {
    const address = useAddress();
    const { contract, isLoading } = useContract(
      process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
    );

    const { data: totalCommission } = useContractRead(contract, "operatorTotalCommission")
    const { mutateAsync: drawWinnerTicket } = useContractWrite(contract, "DrawWinnerTicket")
    const { mutateAsync: refundAll } = useContractWrite(contract, "RefundAll")
    const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw")
    const { mutateAsync: withdrawCommission } = useContractWrite(contract, "WithdrawCommission")

    const drawWinner = async () => {
       // if (!ticketPrice) return;
       const notification = toast.loading("Drawing tickets...");
       try {
         const data = await drawWinnerTicket([{}]);

         toast.success("Tickets drawn successfully", {
           id: notification,
         });
         console.info("contract call success", data);
       } catch (err) {
        toast.error("Whoops something went wrong!", {
            id: notification
        })
         console.info("contract call failure", err);
       }
    };
    const refundUsers = async () => {
       // if (!ticketPrice) return;
       const notification = toast.loading("Refunding players...");
       try {
         const data = await refundAll([{}]);

         toast.success("Refund done successfully", {
           id: notification,
         });
         console.info("contract call success", data);
       } catch (err) {
        toast.error("Whoops something went wrong!", {
            id: notification
        })
         console.info("contract call failure", err);
       }
    };
     const restartLottery = async () => {
       // if (!ticketPrice) return;
       const notification = toast.loading("Restarting lottery...");
       try {
         const data = await withdrawCommission([{}]);

         toast.success("Restart done successfully", {
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
     const withdrawYourCommission = async () => {
       // if (!ticketPrice) return;
       const notification = toast.loading("Withdrawing commission...");
       try {
         const data = await withdrawCommission([{}]);

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
    
    
  return (
    <div className="text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border">
      <h2>Admin Controls</h2>
      <p>Total Commission to be withdraw: {totalCommission &&
              ethers.utils.formatEther(totalCommission.toString())}{" "}
            {currency}</p>
      <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-2">
        <button onClick={drawWinner} className="admin-button">
          {" "}
          <StarIcon className="h-6 mx-auto mb-2"></StarIcon> Draw Winner
        </button>
        <button onClick={withdrawYourCommission} className="admin-button">
          {" "}
          <CurrencyDollarIcon className="h-6 mx-auto mb-2"></CurrencyDollarIcon>{" "}
          Withdraw Commission
        </button>
        <button onClick={restartLottery} className="admin-button">
          {" "}
          <ArrowPathIcon className="h-6 mx-auto mb-2"></ArrowPathIcon> Restart
          Draw
        </button>
        <button onClick={refundUsers} className="admin-button"> 
          {" "}
          <ArrowUturnDownIcon className="h-6 mx-auto mb-2"></ArrowUturnDownIcon>{" "}
          Refund All
        </button>
      </div>
    </div>
  );
}

export default AdminControls;

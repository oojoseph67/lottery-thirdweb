import { useAddress, useMetamask } from "@thirdweb-dev/react";
import React from "react";
import network from '../network'

function Login() {
  const connectWithMetamask = useMetamask();
  return (
    <div className="bg-[#091818] min-h-screen flex flex-col items-center justify-center text-center">
      <img
        className="rounded-full h-56 w-56 mb-10"
        src="https://i0.wp.com/bulls-world.com/wp-content/uploads/2022/07/maddog-pfp.jpg.png?fit=647%2C655&ssl=1"
        alt="image"
      ></img>
        <h1 className="text-6xl text-white font-bold">T00B11ASS Lottery</h1>
        <br></br>
      <h2 className="text-white">
        Get Started By Logging in with your Metamask <b>(Make sure you are connected to {network})</b>
      </h2>

      <button
        onClick={connectWithMetamask}
        className="bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold"
      >
        Login with Metamask
      </button>
    </div>
  );
}

export default Login;

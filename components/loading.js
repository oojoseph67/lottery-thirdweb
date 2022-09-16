import React from "react";
import { PropagateLoader } from "react-spinners";

function Loading() {
  return (
    <div className="bg-[#091B18]  h-screen flex flex-col items-center justify-center">
      <div className="flex items-center space-x-2 mb-10">
        <img
          className="rounded-full h-20 w-20"
          src="https://i0.wp.com/bulls-world.com/wp-content/uploads/2022/07/maddog-pfp.jpg.png?fit=647%2C655&ssl=1"
          alt=""
        ></img>
        <h1 className="text-lg text-white font-bold">
          Loading the T00B11ASS Lottery
        </h1>
      </div>
      <PropagateLoader color="white"></PropagateLoader>
    </div>
  );
}

export default Loading;

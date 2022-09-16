import React from 'react'

function Footer() {
  return (
    <footer className="border-t border-emerald-500/20 flex items-center text-white justify-between p-5">
      <img
        className="h-10 w-10 filter hue-rotate-90 opacity-20 rounded-full"
        src="https://i0.wp.com/bulls-world.com/wp-content/uploads/2022/07/maddog-pfp.jpg.png?fit=647%2C655&ssl=1"
        alt=""
      ></img>

      <p className="text-m text-emerald-500 pl-5">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </footer>
  );
}

export default Footer
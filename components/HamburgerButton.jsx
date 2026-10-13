import React from "react";
import Image from "next/image";

const HamburgerButton = ({ isMenuOpen, setIsMenuOpen }) => {
  const handleMenuClick = (e) => {
    e.preventDefault();
    setIsMenuOpen((prevState) => !prevState);
    console.log(`menu is ${!isMenuOpen ? 'Open' : 'Closed'}`, e.target);
  };

  return (
    <button
      className="text-xl relative w-[2.4rem] h-[44px] rounded-md cursor-pointer hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2"
      onClick={handleMenuClick}
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
    >
      <Image
        id={isMenuOpen ? "close-menu" : "open-menu"}
        src={isMenuOpen ? "/burger-cross.svg" : "/burger.svg"}
        alt="menu-button"
        priority
        fill
      />
    </button>
  );
};

export default HamburgerButton;

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
      className="text-xl relative w-[2.2rem] h-[36px] cursor-pointer"
      onClick={handleMenuClick}
    >
      <Image
        id={isMenuOpen ? "close-menu" : "open-menu"}
        src={isMenuOpen ? "/burger-white-cross.svg" : "/burger-white.svg"}
        alt="menu-button"
        priority
        fill
      />
    </button>
  );
};

export default HamburgerButton;

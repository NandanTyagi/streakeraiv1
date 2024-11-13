import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center w-full items-center sm:items-end sm:pr-6 z-[0] absolute bottom-0 max-w-[1480px]">
      <a href="https://www.devnty.com">
        {" "}
        <Image
          className="z-[-1]"
          src={"/devnty-logo.png"}
          alt="menu-button"
          priority
          height={80}
          width={120}
        />
      </a>
    </footer>
  );
};

export default Footer;

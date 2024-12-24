import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center w-full items-center sm:items-end sm:pr-6 z-[0] absolute bottom-0 max-w-[1480px] bg-gradient-to-r from-blue-100 to-purple-100">
      <a href="https://www.devnty.com">
        {" "}
        <Image
          className="z-[-1]"
          src={"/devnty-logo-svg-mini.svg"}
          alt="menu-button"
          priority
          height={36}
          width={109}
        />
      </a>
    </footer>
  );
};

export default Footer;

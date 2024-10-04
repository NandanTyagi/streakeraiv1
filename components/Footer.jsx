import Image from "next/image";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center relative z-[0]">
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

import Image from "next/image";

const Footer = () => {
    return ( 
        <a href="https://www.devnty.com">
        <footer className="flex flex-col justify-center items-center relative z-[-1]">
          {" "}
          <Image
            className="z-[-1] mt-[-24px]"
            src={"/devnty.png"}
            alt="menu-button"
            priority
            height={80}
            width={120}
          />
        </footer>
      </a>
     );
}
 
export default Footer;
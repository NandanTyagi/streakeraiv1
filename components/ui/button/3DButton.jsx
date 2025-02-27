const ThreeDButton = ({text, onClick, children, title, isSaved, isHistory}) => {
    return (
      <button onClick={(e)=>onClick(e)} title={title} className={`group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-none bg-gradient-to-tr ${isSaved ? "from-[#bcbcbf] to-[#ededee]": isHistory ? 'from-[#bcbcbf] to-[#ededee]' :"from-[#f06d6d] to-[#f82020]"} px-4 py-[2px] text-black shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-none active:shadow-none`}>
        <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"></span>
        <span className="relative font-medium flex w-[100px] sm:w-[70px]">
            {children}
        </span>
      </button>
    )
  }
  
  export default ThreeDButton
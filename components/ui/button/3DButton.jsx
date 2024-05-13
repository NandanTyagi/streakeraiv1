const ThreeDButton = ({text, onClick, children, title}) => {
    return (
      <button onClick={(e)=>onClick(e)} title={title} className="group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-red-700 bg-gradient-to-tr from-[#bcbcbf] to-[#ededee] px-4 py-[2px] text-black shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-red-600 active:shadow-none">
        <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"></span>
        <span className="relative font-medium flex w-[100px] sm:w-[70px]">
            {children}
        </span>
      </button>
    )
  }
  
  export default ThreeDButton
const ThreeDButton = ({text, onClick, children, title, isSaved}) => {
    return (
      <button onClick={(e)=>onClick(e)} title={title} className={`group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[var(--ink)] bg-[var(--paper-veil)] px-4 py-[4px] text-[var(--ink)] transition-colors duration-150 ease-in-out hover:bg-[var(--surface)]`}>
        <span className="relative font-medium flex w-[fit-content] sm:w-[70px]">
            {children}
        </span>
      </button>
    )
  }
  
  export default ThreeDButton

import {motion} from "motion/react";

const SearchDrawer = ({handleClick}: {handleClick: () => void}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClick}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm cursor-pointer"
      />

      {/* Right Drawer Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed top-0 right-0 bottom-0 h-full w-[95vw] sm:w-[65vw] md:w-[45vw] max-w-100 z-50 bg-background text-secondary shadow-2xl flex flex-col p-5 sm:p-6 md:p-8"
      >
        {/* Header with identical Close Button Placement */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <span className="text-[14px] font-semibold tracking-widest uppercase">
            Search Vehicles
          </span>
          <button
            onClick={handleClick}
            className="border border-secondary rounded px-3 py-0.5 text-[12px] sm:text-[14px] font-bold tracking-tighter uppercase transition-all duration-200 hover:border-secondary text-secondary focus:outline-none cursor-pointer"
          >
            CLOSE
          </button>
        </div>

        {/* Minimalist Input Layer Container */}
        <div className="w-full border-b border-secondary/30 py-2 flex items-center">
          <input
            type="text"
            placeholder="TYPE TO SEARCH..."
            autoFocus
            className="w-full bg-transparent border-none text-[14px] sm:text-[15px] tracking-widest uppercase text-secondary placeholder-secondary focus:outline-none focus:ring-0 py-2"
          />
          <svg
            className="w-5 h-5 text-secondary ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </motion.div>
    </>
  );
};

export default SearchDrawer;
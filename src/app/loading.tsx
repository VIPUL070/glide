function Loading() {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-md select-none pointer-events-none">
      
      <style>{`
        @keyframes premium-bar-shimmer {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>

      <div className="absolute top-0 left-0 right-0 h-0.5 w-full bg-neutral-900 overflow-hidden">
        <div className="h-full w-1/3 bg-linear-to-r from-transparent via-white to-transparent animate-[premium-bar-shimmer_1.5s_infinite_ease-in-out]" />
      </div>

      <div className="relative flex flex-col items-center gap-4">
        
        <div className="w-10 h-10 border-[1.5px] border-neutral-800 border-t-white rounded-full animate-spin [animation-duration:0.8s]" />

        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-mono animate-pulse">
          Loading
        </span>
      </div>
    </div>
  );
}

export default Loading;
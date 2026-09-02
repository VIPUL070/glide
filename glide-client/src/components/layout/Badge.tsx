const Badge = ({ counts }: { counts: number | string }) => {
  return (
  <span
    className="
      inline-flex items-center justify-center
      min-w-5 h-5 pr-0.5 mx-1.5 
      rounded-full bg-red-500 text-white
      text-xs font-bold leading-none
    "
  > 
    {Number(counts) > 99  ? "99+" : counts}
  </span>
  );
};

export default Badge;
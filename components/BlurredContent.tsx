interface BlurredContentProps {
  children: React.ReactNode;
  isBlurred: boolean;
  onUpgradeClick?: () => void;
}

export default function BlurredContent({ children, isBlurred, onUpgradeClick }: BlurredContentProps) {
  if (!isBlurred) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="blur-sm select-none pointer-events-none">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
        <button
          onClick={onUpgradeClick}
          className="bg-orange text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange/90 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Unlock Premium to View
        </button>
      </div>
    </div>
  );
}

'use client';

import confetti from 'canvas-confetti';

// Update notice banner component
interface UpdateNoticeProps {
  onReload: () => void;
}

export default function UpdateNotice({ onReload }: UpdateNoticeProps) {
  const handleClick = () => {
    // Trigger confetti from the button location
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 } // Bottom of screen where button is
    });

    // Wait a moment for confetti to show, then reload
    setTimeout(onReload, 300);
  };

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-navy text-white px-6 py-4 rounded-lg shadow-lg z-[9999] cursor-pointer max-w-[90%] hover:bg-orange transition"
    >
      <strong>New version available!</strong> Click here to reload the page.
    </div>
  );
}

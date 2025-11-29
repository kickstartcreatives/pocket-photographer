'use client';

interface UpdateNoticeProps {
  onReload: () => void;
}

export default function UpdateNotice({ onReload }: UpdateNoticeProps) {
  return (
    <div
      onClick={onReload}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-orange text-white px-6 py-4 rounded-lg shadow-lg z-[9999] cursor-pointer max-w-[90%] hover:bg-navy transition"
    >
      <strong>New version available!</strong> Click here to reload the page.
    </div>
  );
}

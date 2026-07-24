'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] text-[#111111]">
          <h2 className="text-2xl font-black mb-4">Something went wrong!</h2>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-[#FF5A1F] text-white rounded-xl"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
"use client";

interface TradeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TradeModal({
  open,
  onClose,
}: TradeModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-zinc-950
          p-6
        "
      >
        <h2 className="text-2xl font-bold">
          Trade Stock
        </h2>

        <div className="mt-6 space-y-4">
          <input
            placeholder="Quantity"
            type="number"
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black
              p-3
            "
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              className="
                rounded-xl
                bg-green-500
                py-3
                font-semibold
                text-black
              "
            >
              Buy
            </button>

            <button
              className="
                rounded-xl
                bg-red-500
                py-3
                font-semibold
              "
            >
              Sell
            </button>
          </div>

          <button
            onClick={onClose}
            className="
              w-full
              rounded-xl
              border
              border-white/10
              py-3
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
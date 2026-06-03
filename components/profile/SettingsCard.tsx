"use client";

export default function SettingsCard() {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-6
      backdrop-blur-xl
    "
    >
      <h2 className="mb-6 text-2xl font-semibold">
        Account Settings
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Full Name
          </label>

          <input
            type="text"
            defaultValue="Keshav Prasad"
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/20
              p-3
              outline-none
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Email
          </label>

          <input
            type="email"
            defaultValue="keshav@example.com"
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/20
              p-3
              outline-none
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Investor Bio
          </label>

          <textarea
            rows={4}
            placeholder="Tell others about your investing style..."
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-black/20
              p-3
              outline-none
            "
          />
        </div>

        <button
          className="
            w-full
            rounded-xl
            bg-green-500
            py-3
            font-semibold
            text-black
            transition
            hover:bg-green-400
          "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
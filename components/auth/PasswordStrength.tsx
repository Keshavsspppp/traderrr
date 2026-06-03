"use client";

interface Props {
  password: string;
}

export default function PasswordStrength({
  password,
}: Props) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const width = `${strength * 25}%`;

  const label =
    strength <= 1
      ? "Weak"
      : strength <= 3
      ? "Medium"
      : "Strong";

  return (
    <div>
      <div className="h-2 bg-zinc-800 rounded-full">
        <div
          style={{ width }}
          className="h-2 rounded-full bg-green-500 transition-all"
        />
      </div>

      <p className="text-xs mt-2 text-zinc-400">
        {label}
      </p>
    </div>
  );
}
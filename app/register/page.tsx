import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold mb-2">
        Create Account
      </h2>

      <p className="text-zinc-400 mb-8">
        Begin your investing journey.
      </p>

      <RegisterForm />
    </AuthLayout>
  );
}
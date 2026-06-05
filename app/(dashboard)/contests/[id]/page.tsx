import ContestDetailClient from "@/components/contests/ContestDetailClient";

export default async function ContestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ContestDetailClient contestId={id} />;
}

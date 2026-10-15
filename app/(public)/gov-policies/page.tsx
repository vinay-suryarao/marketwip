import GovPoliciesDisplay from "@/components/shared/GovPoliciesDisplay";

export default function GovPoliciesPage() {
  return (
    <main className="relative mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 md:py-10">
      <GovPoliciesDisplay />
    </main>
  );
}

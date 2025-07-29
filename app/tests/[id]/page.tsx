import { TestOverview } from "@/components/tests/test-overview"

export default function TestOverviewPage({ params }: { params: { id: string } }) {
  return <TestOverview testId={params.id} />
}

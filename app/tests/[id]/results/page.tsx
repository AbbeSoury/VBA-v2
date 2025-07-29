import { TestResults } from "@/components/tests/test-results"

export default function TestResultsPage({ params }: { params: { id: string } }) {
  return <TestResults testId={params.id} />
}

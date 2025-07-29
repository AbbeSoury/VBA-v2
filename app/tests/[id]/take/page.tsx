import { TestTaking } from "@/components/tests/test-taking"

export default function TestTakingPage({ params }: { params: { id: string } }) {
  return <TestTaking testId={params.id} />
}

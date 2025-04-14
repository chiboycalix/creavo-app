import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Policies</h1>

      <p className="text-gray-700 mb-4">By using Crevoe, you agree to our Terms & Conditions, which cover:</p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
        <li>User responsibilities and content ownership</li>
        <li>AI-generated content policies</li>
        <li>Marketplace transactions and dispute resolution</li>
        <li>Account security and termination rules</li>
      </ul>

      <p className="text-gray-700">
        Read our full{" "}
        <Link href="/terms-conditions" className="text-blue-600 hover:underline">
          Terms & Conditions
        </Link>{" "}
        to understand your rights and obligations.
      </p>
    </div>
  )
}

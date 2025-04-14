export default function SafetyPage() {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Safety</h1>
  
        <p className="text-gray-700 mb-4">Your safety is our top priority. Crevoe implements:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Advanced security measures to protect user accounts.</li>
          <li>Content moderation to prevent harmful or misleading content.</li>
          <li>Community reporting tools to flag inappropriate activities.</li>
        </ul>
        <hr className="text-black" />
  
        <p className="text-gray-700 font-medium my-5">Stay safe by:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Using strong passwords and enabling two-factor authentication (2FA).</li>
          <li>Verifying buyer and seller credibility before transactions.</li>
          <li>Reporting suspicious activity through our Safety Center.</li>
        </ul>
  
        <p className="text-gray-700">
          For security concerns, email{" "}
          <a href="mailto:safety@crevoe.com" className="text-primary hover:underline">
            safety@crevoe.com
          </a>
          .
        </p>
      </div>
    )
  }
  
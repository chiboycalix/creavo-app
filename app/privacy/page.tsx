import Link from "next/link"

export default function PrivacyCenter() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Center</h1>

      <p className="text-gray-700 mb-4">
        At Crevoe, we are deeply committed to protecting your privacy and personal data. We maintain high standards of
        data governance in compliance with leading local and international privacy frameworks, including:
      </p>

      <ul className="list-disc pl-8 mb-6 space-y-2">
        <li className="text-gray-700">Nigeria&apos;s Data Protection Act (NDPA)</li>
        <li className="text-gray-700">General Data Protection Regulation (GDPR) – European Union</li>
        <li className="text-gray-700">California Consumer Privacy Act (CCPA) – United States</li>
      </ul>

      <p className="text-gray-700 mb-6">
        We uphold transparency and integrity in how we collect, process, store, transmit, and share your personal
        information.
      </p>

      <hr className="border-gray-200 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Your Privacy Rights & Controls</h2>

        <p className="text-gray-700 mb-4">
          As a Crevoe user, you retain full control over your personal data. Your rights include, but are not limited
          to:
        </p>

        <ul className="list-disc pl-8 space-y-3">
          <li className="text-gray-700">
            <span className="font-medium">Data Collection Preferences:</span> You can manage what types of data we
            collect (e.g., behavioral, technical, or preference data) and set limits on how this data is used for
            personalized services, analytics, or advertising.
          </li>
          <li className="text-gray-700">
            <span className="font-medium">Content Sharing & Monetization Settings:</span> You control how your content
            is shared, who can view it, and under what terms it can be monetized. These settings are provided, but may
            be customized within your account dashboard.
          </li>
          <li className="text-gray-700">
            <span className="font-medium">Account Privacy Settings:</span> You may configure the visibility of your
            account, public profile, activity logs, engagement metrics, and community interactions at any time.
          </li>
          <li className="text-gray-700">
            <span className="font-medium">Right to Access and Correction:</span> You have the right to request access to
            your personal data, rectify any inaccuracies, and update outdated information.
          </li>
        </ul>

        <p className="text-gray-700 mt-4">
          Right to Deletion and Restriction: Subject to applicable laws, you may request deletion of your account and
          personal data or restrict certain data from being processed.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data Security & Integrity</h2>

        <p className="text-gray-700 mb-4">
          We implement industry-standard technical, administrative, and physical safeguards to ensure the integrity,
          confidentiality, and availability of your data. These include, but are not limited to:
        </p>

        <ul className="list-disc pl-8 space-y-2">
          <li className="text-gray-700">End-to-end encryption for data transmission</li>
          <li className="text-gray-700">Multi-layered access controls</li>
          <li className="text-gray-700">Intrusion detection systems and regular vulnerability scans</li>
          <li className="text-gray-700">Staff access restrictions based on least privilege</li>
          <li className="text-gray-700">Periodic audits and third-party assessments</li>
        </ul>

        <p className="text-gray-700 mt-4">
          While no system is completely immune to risks, we take all reasonable and appropriate measures to prevent
          unauthorized access, misuse, or data breaches. In the event of a breach, users will be notified in accordance
          with applicable laws.
        </p>
      </section>

      <hr className="border-gray-200 my-8" />

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. International Data Transfers</h2>

        <p className="text-gray-700 mb-4">
          If you are located outside Nigeria, your data may be transferred to, stored, or processed in Nigeria or other
          countries where Crevoe or its trusted service providers operate. We ensure that such transfers comply with:
        </p>

        <ul className="list-disc pl-8 space-y-2">
          <li className="text-gray-700">Applicable data protection laws in your jurisdiction</li>
          <li className="text-gray-700">
            Standard contractual clauses or other lawful mechanisms as required by the GDPR or equivalent frameworks
          </li>
          <li className="text-gray-700">
            Adequate technical and organizational safeguards to protect your data in the destination country
          </li>
        </ul>

        <p className="text-gray-700 mt-4">
          By using Crevoe, you consent to such cross-border transfers, subject to your rights under applicable law.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Policy Access & Support</h2>

        <p className="text-gray-700 mb-2">
          We strongly encourage you to read our comprehensive{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          , which outlines in detail:
        </p>

        <ul className="list-disc pl-8 space-y-2 mb-4">
          <li className="text-gray-700">The categories of personal and technical data we collect</li>
          <li className="text-gray-700">
            Our legal bases for processing, including consent, contractual necessity, and legitimate interests
          </li>
          <li className="text-gray-700">Data retention periods, including timelines for deletion or anonymization</li>
          <li className="text-gray-700">
            Your rights under local and international privacy laws and how to exercise them
          </li>
        </ul>

        <p className="text-gray-700">
          If you have any privacy-related questions, requests, or concerns, you may contact us at:{" "}
          <a href="mailto:privacy@crevoe.com" className="text-primary hover:underline">
            privacy@crevoe.com
          </a>
        </p>
      </section>
    </div>
  )
}

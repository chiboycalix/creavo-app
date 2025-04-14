import Image from "next/image";

export default function CompanyPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Company</h1>

      <p className="text-gray-700  mb-8">
        Crevoe is a dynamic platform that empowers creators, entrepreneurs, and
        businesses to connect, create, and thrive in the digital space. Our
        mission is to integrate content creation, social engagement, and digital
        commerce into one seamless experience.
      </p>

      <div className="mb-8">
        <Image
          src="/assets/group.png"
          width={800}
          height={400}
          alt="Team members collaborating around laptops"
          className="rounded-lg w-full"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          At Crevoe, we believe in:
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Empowering creators with tools to showcase and monetize their
            talents.
          </li>
          <li>
            Building a community where knowledge, skills, and opportunities are
            shared.
          </li>
          <li>
            Ensuring accessibility and security while fostering innovation.
          </li>
        </ul>
      </div>

      <p className="text-gray-700">
        For partnerships, collaborations, or press inquiries, contact us at
        contact@crevoe.com.
      </p>
    </div>
  );
}

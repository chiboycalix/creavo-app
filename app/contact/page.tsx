import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative w-screen h-[500px] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <Image
          src="/assets/group.png"
          alt="Customer support representative on phone"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center px-8 md:px-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Contact Us
          </h1>
        </div>
      </div>

      {/* Contact Information */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <p className="text-center text-lg mb-8">
          Need assistance? We&apos;re here to help! Reach out to us through the
          following channels:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Support */}
          <div className="bg-gray-50 md:w-[30em] flex flex-col items-start gap-2 p-6 rounded-lg">
            <Mail className="h-6 w-6 text-primary mr-2" />

            <div className="flex  flex-col items-start  mb-4">
              <h2 className="text-sm text-gray-400 font-medium">Email Support:</h2>
              <a
                href="mailto:support@crevoe.com"
                className="text-primary hover:underline"
              >
                support@crevoe.com
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-gray-50 md:w-[30em] flex flex-col gap-2 items-start p-6 rounded-lg">
            <Phone className="h-6 w-6 text-primary mr-2" />

            <div className="flex flex-col items-start mb-4">
              <h2 className="text-sm text-gray-400 font-medium">Phone:</h2>
              <a
                href="mailto:support@crevoe.com"
                className="text-primary hover:underline"
              >
                support@crevoe.com
              </a>
            </div>
          </div>

          {/* Global Inquiries */}
          <div className="bg-gray-50 md:w-[30em] flex flex-col gap-2 items-start p-6 rounded-lg md:col-span-2">
            <Globe className="h-6 w-6 text-primary mr-2" />

            <div className="flex flex-col items-start mb-4">
              <h2 className="text-sm text-gray-400 font-medium">Global Inquiries:</h2>
              <a
                href="mailto:contact@crevoe.com"
                className="text-primary hover:underline"
              >
                contact@crevoe.com
              </a>
            </div>
          </div>
        </div>

        <p className="text-center mt-8">
          For urgent inquiries, visit our{" "}
          <Link href="/help" className="text-primary hover:underline">
            Help Center
          </Link>{" "}
          for quick answers.
        </p>
      </div>
    </div>
  );
}

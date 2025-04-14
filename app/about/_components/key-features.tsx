import Image from "next/image";

export default function KeyFeatures() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-center text-4xl font-bold mb-16">
        Our Key Features Include:
      </h2>

      <div className="grid grid-cols-12 gap-6 relative">
        {/* Left section */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Digital Product card */}
          <div className="relative h-[280px] w-full">
            <Image
              src="/assets/digital.png"
              width={400}
              height={300}
              alt="Person looking at phone outdoors"
              className="rounded-xl object-cover h-full w-full"
            />
          </div>

          {/* Courses card */}

          {/* Person on couch image */}
          <div className="relative mt-4">
            <Image
              src="/assets/lady.png"
              width={400}
              height={300}
              alt="Person using tablet on couch"
              className="rounded-xl object-cover w-full"
            />
          </div>
        </div>

        {/* Center section - large image */}
        <div className="col-span-12 lg:col-span-3 flex justify-center">
          <div className="relative h-full w-full">
            <Image
              src="/assets/boy.png"
              width={400}
              height={600}
              alt="Person looking at phone outdoors"
              className="rounded-xl object-cover h-full w-full"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* AI-powered tools card */}
          <div className="flex gap-5">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="mb-4">
                <Image
                  src="/assets/ai.png"
                  width={250}
                  height={150}
                  alt="AI visualization"
                  className="rounded-lg object-cover w-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-powered tools</h3>
              <p className="text-gray-600">
                Enhance content creation with smart automation.
              </p>
            </div>

            {/* Woman with phone image */}
            <div className="">
              <Image
                src="/assets/oldwoman.png"
                width={400}
                height={600}
                alt="Woman using smartphone"
                className="rounded-xl h-full object-cover  "
              />
            </div>
          </div>

          {/* Social engagement card */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Social engagement</h3>
            <p className="text-gray-600 text-center">
              Share content, build your audience, and engage with like-minded
              creators.
            </p>

            {/* Profile images row */}
            <div className="flex justify-center mt-6 space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-16 h-20 overflow-hidden"
                  style={{
                    borderRadius: "40px / 50px",
                  }}
                >
                  <Image
                    src="/assets/heroimg1.png"
                    width={60}
                    height={80}
                    alt={`Profile ${i}`}
                    className="object-cover h-full w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

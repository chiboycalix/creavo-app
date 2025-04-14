import Image from "next/image"
import KeyFeatures from "./_components/key-features"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">What is Crevoe?</h1>
          <p className="text-gray-700 text-lg">
            Crevoe is a next-generation platform designed to bridge the gap between creativity and commerce. Whether
            you&apos;re an artist, educator, entrepreneur, or digital creator, Crevoe provides an ecosystem where you can
            produce, share, and sell digital content.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Image
            src="/assets/heroimg1.png"
            alt="People using Crevoe platform"
            width={500}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <KeyFeatures />     
      </div>

      {/* Community Section */}
      {/* <div className="text-center">
        <h3 className="text-2xl font-semibold mb-6">Join our growing community of creators</h3>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-16 h-16 rounded-full overflow-hidden relative">
              <Image
                src={`/placeholder.svg?height=64&width=64&text=${i}`}
                alt={`Community member ${i}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}

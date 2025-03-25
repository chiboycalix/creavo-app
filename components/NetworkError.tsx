// app/components/NetworkError.tsx
import React from 'react';
import Link from 'next/link';

const NetworkError = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="text-2xl font-bold text-yellow-600">LOGO</div>
        <nav className="space-x-6">
          <Link href="/" className="text-gray-600 hover:text-yellow-600">
            Home
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-yellow-600">
            About Us
          </Link>
          <Link href="/services" className="text-gray-600 hover:text-yellow-600">
            Services
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-yellow-600">
            Contact Us
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row items-center justify-center p-10 space-y-8 md:space-y-0 md:space-x-12">
        {/* Text Section */}
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">NETWORK ERROR</h1>
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, nonummy nibh
            eiusmod tincidunt ut laoreet dolore magna erat volutpat. Ut wisi enim ad
            minim veniam, quis nostrud tation ullamcorper suscipit lobortis nisl ut
            aliquip ex ea consequat.
          </p>
          <button className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition">
            Read More
          </button>
        </div>

        {/* Illustration Section */}
        <div className="relative">
          {/* Placeholder for the illustration */}
          <div className="w-96 h-72 bg-gray-200 flex items-center justify-center rounded-lg">
            <p className="text-gray-500">
              [Illustration: Two people with a monitor showing &ldquo;No Connection&rdquo;]
            </p>
          </div>
          {/* Decorative Dots */}
          <div className="absolute bottom-4 left-0 flex space-x-2">
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NetworkError;
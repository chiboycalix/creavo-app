"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import Image from "next/image";

export default function SimpleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="  px-16 py-3 flex items-center justify-start  gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="">
            <img
              src="/assets/crevoe.svg"
              alt=""
              className="flex -mt-5"
            />
          </Link>
          <div className="w-6" /> 
        </div>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/20"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="relative w-64 max-w-xs bg-white h-full flex flex-col overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b">
              <Link href="/" className="text-2xl font-bold text-[#0a3b5c]">
                <img
                  src="/assets/crevoe.svg"
                  alt=""
                  className="inline-block -mt-2"
                />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-700"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 p-4">
              <div className="space-y-4">
                <p className="font-medium">Company</p>
                <ul className="space-y-3 pl-1">
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      About Us
                    </Link>
                  </li>
                  
                  <li>
                    <Link
                      href="/terms-policies"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Terms and Policies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/community-guidelines"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Community Guidelines
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Privacy Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/help"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/safety"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Safety
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1 px-10">{children}</main>

      <footer className="bg-black mx-5 text-white rounded-t-3xl mt-8 px-8 py-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="text-2xl font-bold">
                <img
                  src="/assets/crevoe.svg"
                  alt=""
                  className="inline-block -mt-2"
                />
              </Link>
              <p className="text-sm text-gray-300">
                Create. Connect. Create. All In One Place
              </p>
              <p className="text-xs text-gray-400 pt-4">
                © 2023 Grevoe. All rights reserved.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Terms and Conditions
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Terms and Policies</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/guidelines"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Community Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Privacy Center
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Help Center</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/safety"
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Safety
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

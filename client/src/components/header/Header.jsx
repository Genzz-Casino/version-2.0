import { useState } from "react";
import { FaChevronDown, FaChevronRight, FaArrowLeft } from "react-icons/fa";

const LOGO = "https://bkashloan-info.com/img/Bkash.png";

const NAV_LINKS = [
  { label: "Personal", bengali: "ব্যক্তিগত", hasDropdown: true },
  { label: "Business", bengali: "ব্যবসায়িক", hasDropdown: true },
  { label: "সাহায্য", bengali: "সহায়তা", hasDropdown: false },
  { label: "সম্পর্কে", bengali: "সম্পর্কে", hasDropdown: true },
  { label: "ক্যারিয়ার", bengali: "ক্যারিয়ার", hasDropdown: true },
  { label: "ব্লগ", bengali: "ব্লগ", hasDropdown: false },
  { label: "ডেভেলপার", bengali: "ছাত্র", hasDropdown: false },
];

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 z-[100]"
        style={{ backgroundColor: "#e2136e" }}
      >
        <div className="w-full mx-auto px-4 md:px-10 xl:px-44 flex items-center justify-between h-14 md:h-16">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              src={LOGO}
              alt="bKash"
              className="h-8 md:h-10 object-contain"
            />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href="#"
                className="flex items-center gap-1 text-white font-medium px-3 py-2 rounded hover:bg-pink-700 transition-colors whitespace-nowrap"
                style={{ fontSize: "0.95rem" }}
              >
                {link.label}
                {link.hasDropdown && (
                  <FaChevronDown className="text-white opacity-80" style={{ fontSize: "0.65rem" }} />
                )}
              </a>
            ))}
          </div>

          {/* Right Side: ENG + Button */}
          <div className="hidden md:flex items-center gap-2">
            <button
              className="flex items-center gap-1 text-white font-medium px-3 py-1.5 rounded hover:bg-pink-700 transition-colors border border-white border-opacity-40"
              style={{ fontSize: "0.95rem" }}
            >
              ENG
              <FaChevronDown className="text-white opacity-80" style={{ fontSize: "0.65rem" }} />
            </button>
            <button
              className="font-semibold px-5 py-2 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
              style={{ backgroundColor: "white", color: "#e2136e", fontSize: "0.95rem" }}
            >
              বিকাশ অ্যাপ নিন
            </button>
          </div>

          {/* Mobile: Language switcher + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {/* Language pill */}
            <div className="flex items-center border border-white border-opacity-60 rounded-full overflow-hidden text-xs font-semibold">
              <span className="bg-white text-pink-600 px-2.5 py-1">বাং</span>
              <span className="text-white px-2.5 py-1">En</span>
              <span className="text-white pr-2 pl-1 py-1">
                <FaChevronDown style={{ fontSize: "0.55rem" }} />
              </span>
            </div>
            {/* Hamburger */}
            <button
              className="text-white text-2xl p-1"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] bg-opacity-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white z-[10000000] flex flex-col shadow-2xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 h-14"
          style={{ backgroundColor: "#e2136e" }}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-lg p-1"
            aria-label="Close menu"
          >
            <FaArrowLeft />
          </button>
          <img src={LOGO} alt="bKash" className="h-7 object-contain" />
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className="flex items-center justify-between px-6 py-4 text-gray-800 text-base font-medium border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <span>{link.bengali}</span>
              {link.hasDropdown && (
                <FaChevronRight className="text-gray-400 text-sm" />
              )}
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="px-5 py-6 border-t border-gray-100 bg-white">
          <p className="text-center text-gray-500 text-sm mb-4">
            বিকাশ এক্সপেরিয়েন্স করতে
          </p>
          <button
            className="w-full py-3.5 rounded-xl text-white font-bold text-base tracking-wide transition hover:opacity-90"
            style={{ backgroundColor: "#e2136e" }}
          >
            অ্যাপ ডাউনলোড করুন
          </button>
        </div>
      </div>
    </>
  );
}
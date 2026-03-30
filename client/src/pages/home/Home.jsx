import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaMobileAlt,
  FaHashtag,
  FaGlobe,
} from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Header from "../../components/header/Header";

const LOGO = "https://bkashloan-info.com/img/Bkash.png";
const BANNER_HERO = "https://bkashloan-info.com/img/loan_1703837924854.webp";
const LOAN_IMG = "https://bkashloan-info.com/img/website-loan_1711547275595.webp";
const PAYLATER_IMG = "https://bkashloan-info.com/img/website-pay-later_1711552228780.webp";
const APP_PLATFORM = "https://bkashloan-info.com/img/Available-on-Multiple-Platforms_App.webp";
const FOOTER_LOGO = "https://bkashloan-info.com/img/bkash-logo-bkash-mobile-payment-service-logo.png";
const QR_IMG = "https://bkashloan-info.com/img/rq-140px-x-140px_1701968485695.webp";
const LIVECHAT = "https://bkashloan-info.com/img/livechat.png";

const GOOGLE_PLAY_IMG = "https://bkashloan-info.com/img/google.png";
const APP_STORE_IMG = "https://bkashloan-info.com/img/apstore.png";

const SERVICES = [
  { img: "https://bkashloan-info.com/img/01-send-money_1666154832042.webp", label: "সেন্ড মানি" },
  { img: "https://bkashloan-info.com/img/02-mobile-recharge_1666155167971.webp", label: "মোবাইল রিচার্জ" },
  { img: "https://bkashloan-info.com/img/04-payment_1666159400113.webp", label: "পেমেন্ট" },
  { img: "https://bkashloan-info.com/img/03-cash-out_1666158620022.webp", label: "ক্যাশ আউট" },
  { img: "https://bkashloan-info.com/img/bkash-bundle-icon-120-x-120_1742458535171.webp", label: "বান্ডেল অফার" },
  { img: "https://bkashloan-info.com/img/05-add-money_1666160847291.webp", label: "অ্যাড মানি" },
];

const FAQS = [
  'আমার ফোনে "Singapore/Malaysia/South Korea prefer for mobile number" বার্তা "Update bKash app to use bKash services. If VPN is enabled on your device, please turn it off" দেখাচ্ছে। আমার কী করা উচিত?',
  "লোন",
  "আমি কি বিকাশ থেকে ৫-৮১ সংখ্যার লোন পাবো?",
  "বিকাশ লোন বাতিল করলে কি আমার অ্যাকাউন্টে প্রভাব পড়বে?",
  "ক্রেডিট কার্ডের মাধ্যমে পেমেন্ট করা যাবে?",
  "অ্যাকাউন্টটি লকড হলে কেন এবং কীভাবে আনলক করবো?",
];

const FOOTER_COLS = [
  {
    title: "সেবাসমূহ",
    links: ["সেন্ড মানি", "মোবাইল রিচার্জ", "পেমেন্ট", "ক্যাশ আউট", "অ্যাড মানি", "বিল পেমেন্ট"],
  },
  {
    title: "কোম্পানি",
    links: ["আমাদের সম্পর্কে", "ক্যারিয়ার", "পার্টনার", "মিডিয়া সেন্টার", "প্রাইভেসি পলিসি"],
  },
  {
    title: "সাহায্য",
    links: ["সাপোর্ট", "ব্লগ", "FAQ", "লোকেটার"],
  },
];

const TABS = [
  { label: "অ্যাপ", icon: <FaMobileAlt /> },
  { label: "ইউএসএসডি", icon: <FaHashtag /> },
  { label: "ওয়েব", icon: <FaGlobe /> },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("অ্যাপ");
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="font-sans bg-white min-h-screen text-gray-800">
      {/* NAVBAR */}
      <Header />

      {/* HERO BANNER */}
      <section className="relative w-full overflow-hidden">
        <img
          src={BANNER_HERO}
          alt="bKash Loan Banner"
          className="w-full h-auto block"
        />
      </section>

      {/* LOAN SECTION */}
      <section className="py-10 md:py-16 bg-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-pink-600 mb-3">লোন</h2>
        <p className="text-gray-500 text-base md:text-lg mb-5 max-w-xl mx-auto px-4">
          আপনার প্রয়োজনে, বিকাশ অ্যাপের মাধ্যমে সিটি ব্যাংক থেকে যেকোনো সময় ব্যক্তিগত লোন নিন
        </p>
        <a
        href="/loan-request"

          className="border border-pink-500 text-pink-600 px-7 py-2.5 rounded-full text-base md:text-lg font-medium hover:bg-[#E2136E] hover:text-white cursor-pointer transition"
        >
          বিকাশ থেকে লোন নিতে এখানে ক্লিক করুন
        </a>
      </section>

      {/* LOAN INFO CARD */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-10 md:pb-16">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h3 className="text-xl md:text-2xl font-bold text-pink-600 mb-4">লোন</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              ছোট থেকে বড় যেকোনো ধরনের প্রয়োজনে আপনার প্রিয় সিটি ব্যাংক থেকে বিকাশ অ্যাপের মাধ্যমে ইএমআই সুবিধায় যেকোনো সময় ব্যক্তিগত লোন নিন।
            </p>
            <a
              href="#"
              className="text-pink-600  text-sm flex items-center gap-1 mt-4 hover:underline"
            >
              বিস্তারিত দেখুন <MdOutlineKeyboardArrowRight className="text-xl" />
            </a>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src={LOAN_IMG}
              alt="Loan"
              className="w-full max-w-xs md:max-w-md object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* PAY LATER SECTION */}
      <section className="bg-[#F5F5F5] py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row-reverse items-center gap-10">
            <div className="md:w-1/2">
              <h3 className="text-xl md:text-2xl font-bold text-pink-600 mb-4">পে-লেটার</h3>
              <p className="text-gray-600 text-sm md:text-bas leading-relaxed">
                পছন্দের পণ্য এখন কিনুন আর পরে বিকাশ অ্যাপে ঘরে বসেই কিস্তিতে পে করুন। সিটি ব্যাংক পে-লেটার সুবিধা ব্যবহার করে এখন থেকেই জীবনকে আরও সহজ করুন!
              </p>
              <a
                href="#"
                className="text-pink-600 text-sm flex items-center gap-1 mt-4 hover:underline"
              >
                বিস্তারিত জানতে <MdOutlineKeyboardArrowRight className="text-xl" />
              </a>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src={PAYLATER_IMG}
                alt="Pay Later"
                className="w-full max-w-xs md:max-w-md object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORMS SECTION */}
      <section className="py-10 bg-[#F8E8F0] md:py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <h2 className="text-center text-xl md:text-3xl font-bold text-gray-800 mb-8">
            একাধিক প্ল্যাটফর্মে উপলব্ধ
          </h2>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
                  activeTab === tab.label
                    ? "bg-pink-600 text-white border-pink-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-pink-400"
                }`}
              >
                <span className={activeTab === tab.label ? "text-white" : "text-pink-500"}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="md:w-1/2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">বিকাশ অ্যাপ ডাউনলোড করুন</h3>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                আপনার ফোনে বিকাশ অ্যাপ ডাউনলোড করে নিন এবং যেকোনো সময়, যেকোনো জায়গা থেকে বিকাশের সব সেবা উপভোগ করুন।
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href="#" className="transition hover:opacity-90">
                  <img
                    src={GOOGLE_PLAY_IMG}
                    alt="Google Play"
                    className="h-11 md:h-12 object-contain"
                  />
                </a>
                <a href="#" className="transition hover:opacity-90">
                  <img
                    src={APP_STORE_IMG}
                    alt="App Store"
                    className="h-11 md:h-12 object-contain"
                  />
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src={APP_PLATFORM}
                alt="Platform App"
                className="w-full max-w-xs md:max-w-sm object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-10 md:py-16 bg-[#F8E8F0]">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <h2 className="text-center text-xl md:text-3xl font-bold text-gray-800 mb-8">
            প্রায়শই জিজ্ঞাসিত প্রশ্ন
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-200 bg-white rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-base md:text-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <span className="pr-4">{faq}</span>
                  {openFaq === i
                    ? <FaChevronUp className="text-pink-500 flex-shrink-0" />
                    : <FaChevronDown className="text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-base md:text-lg text-gray-500 bg-gray-50">
                    এই বিষয়ে আরো তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন অথবা বিকাশ অ্যাপ ব্যবহার করুন।
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="border border-pink-500 text-pink-600 px-10 py-2.5 rounded-full text-base md:text-lg font-medium hover:bg-pink-50 transition">
              বিস্তারিত দেখুন
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES SLIDER SECTION */}
      <section className="py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-10">
            বিকাশ সেবা সম্পর্কে আরও জানুন
          </h2>
          <div className="relative">
            <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white border border-gray-200 shadow rounded-full p-2 z-10 hover:bg-pink-50">
              <FaChevronLeft className="text-gray-500 text-sm" />
            </button>
            <div className="grid grid-cols-6 gap-6 md:gap-10 flex-wrap">
              {SERVICES.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-3 cursor-pointer group">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.label}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <span className="text-sm md:text-base text-gray-600 font-medium text-center">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white border border-gray-200 shadow rounded-full p-2 z-10 hover:bg-pink-50">
              <FaChevronRight className="text-gray-500 text-sm" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1E1E1E] text-gray-300 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-gray-700">
            {/* Logo + App Downloads */}
            <div className="col-span-2 md:col-span-1">
              <img
                src={FOOTER_LOGO}
                alt="bKash"
                className="h-10 object-contain mb-4 filter brightness-0 invert"
              />
              <p className="text-sm text-gray-400 mb-4">বিকাশ অ্যাপ ডাউনলোড করুন</p>
              <div className="flex flex-col gap-2 mb-4">
                <a href="#" className="transition hover:opacity-80">
                  <img
                    src={GOOGLE_PLAY_IMG}
                    alt="Google Play"
                    className="h-9 object-contain"
                  />
                </a>
                <a href="#" className="transition hover:opacity-80">
                  <img
                    src={APP_STORE_IMG}
                    alt="App Store"
                    className="h-9 object-contain"
                  />
                </a>
              </div>
            </div>

            {/* Link Columns */}
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm md:text-base mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-xs md:text-sm text-gray-400 hover:text-pink-400 transition"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* QR Codes */}
            <div>
              <h4 className="text-white font-semibold text-sm md:text-base mb-4">ডাউনলোড করুন</h4>
              <div className="flex gap-2">
                <img src={QR_IMG} alt="QR" className="w-14 h-14 object-contain rounded bg-white p-1" />
                <img src={QR_IMG} alt="QR" className="w-14 h-14 object-contain rounded bg-white p-1" />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 gap-4">
            <p className="text-xs md:text-sm text-gray-500">
              © ২০২৪ বিকাশ লিমিটেড। সর্বস্বত্ব সংরক্ষিত।
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition text-lg"><FaFacebookF /></a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition text-lg"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition text-lg"><FaYoutube /></a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition text-lg"><FaLinkedinIn /></a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition text-lg"><FaInstagram /></a>
            </div>
          </div>
        </div>
      </footer>

      {/* LIVE CHAT BUTTON */}
      <a
        href="#"
        className="fixed bottom-6 right-4 z-50 border-[1px] border-white rounded-[25px]"
      >
        <img src={LIVECHAT} alt="Live Chat" className="w-[100px] md:w-[170px]" />
      </a>
    </div>
  );
}
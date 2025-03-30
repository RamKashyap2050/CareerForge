import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-white text-slate-800">
      {/* Header */}
      <header className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide">JobGeniX</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="hover:underline">Features</a>
            <a href="#pricing" className="hover:underline">Pricing</a>
            <a href="#testimonials" className="hover:underline">Testimonials</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
          <a
            href="/signup"
            className="bg-indigo-500 text-white font-bold px-5 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Sign Up
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-20 text-center px-6">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-4">
          Build Your Perfect Resume in Minutes
        </h2>
        <p className="text-lg text-slate-600 mb-6">
          AI-powered, ATS-friendly resumes tailored to each job listing.
        </p>
        <a
          href="/login"
          className="inline-block bg-indigo-500 text-white font-semibold text-lg px-6 py-3 rounded-lg shadow hover:bg-indigo-600 transition"
        >
          Create My Resume Now
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-slate-800 mb-12">Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "AI-Generated Resumes",
                desc: "Tailored resumes matching any job description in minutes."
              },
              {
                title: "ATS-Friendly",
                desc: "Ensures your resume passes applicant tracking systems."
              },
              {
                title: "Automated Job Applications",
                desc: "Let our agent apply to jobs for you, 24/7."
              },
              {
                title: "Real-Time Dashboard",
                desc: "Track every job application from a single panel."
              }
            ].map((f, idx) => (
              <div key={idx} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-slate-700 mb-2">
                  {f.title}
                </h4>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
  id="testimonials"
  className="py-20 bg-gray-100 text-center px-6"
>
  <h3 className="text-3xl font-bold text-slate-800 mb-12">What Users Say</h3>
  <div className="max-w-4xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">
    {[
      {
        name: "John D.",
        quote: "I landed my dream job thanks to JobGeniX!",
        photo: "https://tse3.mm.bing.net/th?id=OIP.MpFoGGnxQ1rwhPxFvgQm6QHaFV&pid=Api&P=0&h=180"
      },
      {
        name: "Sarah K.",
        quote: "Fast, reliable, and beautifully designed resumes.",
        photo: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      {
        name: "Emily R.",
        quote: "I applied to 20 jobs in a day — JobGeniX made it easy.",
        photo: "https://randomuser.me/api/portraits/women/65.jpg"
      }
    ].map((t, idx) => (
      <div
        key={idx}
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
      >
        <img
          src={t.photo}
          alt={t.name}
          className="w-20 h-20 rounded-full object-cover mb-4 shadow"
        />
        <p className="italic text-gray-600 mb-2">"{t.quote}"</p>
        <span className="text-sm font-semibold text-slate-700">- {t.name}</span>
      </div>
    ))}
  </div>
</section>


      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white px-6 text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-12">Pricing</h3>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
          <div className="border border-gray-200 p-6 rounded-lg shadow">
            <h4 className="text-xl font-bold text-slate-700 mb-2">Basic</h4>
            <p className="text-sm text-gray-700 mb-4">
              Free resume builder with core features.
            </p>
            <p className="font-bold text-lg text-slate-800">$0 / month</p>
          </div>
          <div className="border border-indigo-500 p-6 rounded-lg shadow bg-gray-50">
            <h4 className="text-xl font-bold text-slate-800 mb-2">Premium</h4>
            <p className="text-sm text-gray-700 mb-4">
              Access all features + job automation & tracking.
            </p>
            <p className="font-bold text-lg text-slate-800">$9.99 / month</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} JobGeniX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
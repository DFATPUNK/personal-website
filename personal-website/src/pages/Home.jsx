import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center p-8">
      <header className="w-full max-w-4xl flex justify-between items-center py-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold">I Build My Ideas</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#writing" className="hover:underline">Writing</a></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main className="w-full max-w-4xl flex flex-col items-start mt-12 space-y-8">
        <section id="about" className="w-full">
          <h2 className="text-xl font-semibold">About</h2>
          <p className="mt-2 text-gray-700">This is where a short bio or mission statement can go.</p>
        </section>
        <section id="writing" className="w-full">
          <h2 className="text-xl font-semibold">Writing</h2>
          <p className="mt-2 text-gray-700">A collection of thoughts, articles, and insights.</p>
        </section>
        <section id="contact" className="w-full">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-2 text-gray-700">Reach out for collaborations or inquiries.</p>
        </section>
      </main>
      <footer className="w-full max-w-4xl text-center text-gray-600 border-t border-gray-300 py-4 mt-12">
        <p>&copy; {new Date().getFullYear()} I Build My Ideas</p>
      </footer>
    </div>
  );
};

export default Home;
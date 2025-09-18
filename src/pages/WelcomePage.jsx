import React from "react";

const WelcomePage = () => {
  return (
    <main className="flex flex-col md:flex-row items-center justify-between min-h-[calc(93vh-64px)] bg-gray-50 px-8 py-10">
      <div className="md:w-1/2 w-full flex flex-col justify-center items-start pr-1">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          A Place for Stories & Ideas
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Sharing diverse perspectives that inspire growth, deepen
          understanding, and enrich both minds and hearts.
        </p>
        {/* You can add a button or call-to-action here if needed */}
      </div>
      <div className="md:w-1/2 w-full flex justify-center items-center">
        <img
          src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80"
          alt="Stories and Ideas"
          className="rounded-xl shadow-lg w-full h-[300px] object-cover md:h-[400px]"
        />
      </div>
    </main>
  );
};

export default WelcomePage;

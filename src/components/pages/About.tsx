import React,{useEffect} from "react";

const About: React.FC = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50">
      {/* Background Logo */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10 z-0"
        style={{ backgroundImage: "url('src/assets/Logo.png')" }}
      />

      <div className="relative z-20 max-w-4xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-4xl font-bold text-green-700 text-center mb-6">About Us</h1>

        <p className="text-lg text-gray-700 mb-4 text-justify">
          <strong>StarFarmer</strong> is a trusted e-commerce platform dedicated to empowering farmers across India. We provide a wide range of agricultural products including <span className="text-green-600 font-medium">fertilizers</span>, <span className="text-green-600 font-medium">seeds</span>, and <span className="text-green-600 font-medium">farming equipment</span>, all easily accessible online.
        </p>

        <p className="text-lg text-gray-700 mb-4 text-justify">
          Our goal is to bridge the gap between modern agricultural solutions and the grassroots level. We support farmers in multiple languages, ensuring accessibility and ease of use for everyone — no matter where they are located.
        </p>

        <p className="text-lg text-gray-700 mb-4 text-justify">
          We offer both <span className="text-teal-600 font-medium">Cash on Delivery (COD)</span> and secure <span className="text-teal-600 font-medium">PhonePe online payments</span>, with free shipping for online orders. Our platform is designed to be simple, fast, and farmer-friendly.
        </p>

        <p className="text-lg text-gray-700 text-justify">
          Thank you for being a part of the StarFarmer journey. Together, we’re cultivating a better future.
        </p>
      </div>
    </div>
  );
};

export default About;
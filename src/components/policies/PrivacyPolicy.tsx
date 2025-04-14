import { useEffect } from "react";



const PrivacyPolicy = () => {
  const lastUpdated = 'April 14, 2025';
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main className="bg-white text-gray-800 p-6 md:p-10 max-w-4xl mx-auto my-8 rounded-lg shadow-md">
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-6 border-b pb-3">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: {lastUpdated}</p>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">1. Introduction</h2>
        <p className="mb-3">
          Welcome to StarFarmer. We are committed to protecting your personal information and your right to privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website{' '}
          <a href="https://starfarmer-frontend.onrender.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
            StarFarmer
          </a>{' '}
          and purchase our products (insecticides, pesticides, fertilizers, seeds, etc.).
        </p>
        <p>
          Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">2. Information We Collect</h2>
        <p className="mb-3">
          We may collect information about you in a variety of ways. The information we may collect on the site includes:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            <strong>Personal Data:</strong> Information such as your name, shipping address, email, phone number, and demographics provided voluntarily during registration or checkout.
          </li>
          <li>
            <strong>Derivative Data:</strong> Automatically collected data such as IP address, browser type, OS, and pages visited.
          </li>
          <li>
            <strong>Financial Data:</strong> Payment information such as card details, stored securely by our processors (PhonePe, Razorpay). Refer to their privacy policies for more.
          </li>
          <li>
            <strong>Usage Data:</strong> Details about how you interact with our site and services, including viewed or purchased products.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">3. How We Use Your Information</h2>
        <p className="mb-3">We use collected information to provide a better experience and to:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Create and manage your account.</li>
          <li>Process transactions and deliver orders.</li>
          <li>Email you about your account or orders.</li>
          <li>Manage purchases, payments, and returns.</li>
          <li>Improve our site’s performance.</li>
          <li>Analyze trends and enhance user experience.</li>
          <li>Send updates and product news.</li>
          <li>Send newsletters/promos (opt-out anytime).</li>
          <li>Meet legal and regulatory requirements.</li>
          <li>Resolve disputes and troubleshoot issues.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">4. Disclosure of Your Information</h2>
        <p className="mb-3">Your data may be shared as follows:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            <strong>Legal Reasons:</strong> To respond to legal processes or protect rights, property, or safety.
          </li>
          <li>
            <strong>Service Providers:</strong> With vendors like payment processors, hosting providers, shipping/logistics teams, and analytics platforms.
          </li>
          <li>
            <strong>Business Transfers:</strong> During any company sale, merger, or acquisition.
          </li>
          <li>
            <strong>With Your Consent:</strong> For any other disclosed purpose with your permission.
          </li>
        </ul>
        <p className="mt-3">We do <strong>not</strong> sell your personal data to third parties.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">5. Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical safeguards to protect your data. However, no security system is 100% secure,
          and we cannot guarantee the absolute safety of your information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">6. Your Rights</h2>
        <p>
          Under Indian law, you may request access to, correction of, or deletion of your data. Contact us via the details below to exercise these rights.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">7. Policy for Children</h2>
        <p>
          We do not knowingly collect data from children under 18. If you believe we have, please contact us. This site is intended for users 18 and older.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">8. Changes to This Privacy Policy</h2>
        <p>
          We may update this policy occasionally. Any changes will reflect a new "Last Updated" date and will be effective immediately upon posting.
        </p>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">9. Contact Us</h2>
        <p>
          If you have any questions or comments, reach out to us:
          <br />
          <strong>StarFarmer</strong>
          <br />
          Agri Tech Park, Pune
          <br />
          Email: <a href="mailto:contact@starfarmer.com" className="text-blue-600 underline">contact@starfarmer.com</a>
          <br />
          Phone: <a href="tel:+917558332323" className="text-blue-600 underline">+91 7558332323</a>
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;

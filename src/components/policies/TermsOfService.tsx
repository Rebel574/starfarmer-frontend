import React, { useEffect } from 'react';

const TermsOfService: React.FC = () => {
  const lastUpdated = 'April 14, 2025';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main className="bg-white text-gray-800 p-6 md:p-10 max-w-4xl mx-auto my-8 rounded-lg shadow-md">
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-6 border-b pb-3">
        Terms of Service
      </h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: {lastUpdated}</p>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">1. Agreement to Terms</h2>
        <p className="mb-3">
          These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and StarFarmer, concerning your access to and use of the website as well as any other media form, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
        </p>
        <p className="mb-3">
          You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Service.{' '}
          <strong className="text-red-600">
            IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          </strong>
        </p>
        <p>
          Supplemental terms and conditions or documents that may be posted on the Site from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Service at any time and for any reason.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">2. Use of the Site & Product Information</h2>
        <p className="mb-3">
          The Site provides an online retail store for <strong>Agri-related</strong> goods ("Products").
        </p>
        <p className="mb-3">
          <strong>Eligibility:</strong> You must be at least 18 years of age to use this Site and purchase Products, particularly regulated items like pesticides and certain medicines. By using the Site, you represent and warrant that you meet this age requirement and that you will comply with all applicable local, state, national, and international laws and regulations regarding the purchase, possession, and use of the Products.
        </p>
        <p className="mb-3">
          <strong>Product Descriptions:</strong> We strive to be as accurate as possible in descriptions of Products. However, we do not warrant that Product descriptions or other content is accurate, complete, reliable, current, or error-free. Information provided is often based on manufacturer specifications.
        </p>
        <p className="mb-3 font-semibold text-red-600">
          <strong>Safety and Compliance (Crucial):</strong> You are solely responsible for the safe handling, storage, application, and disposal of Products purchased, especially pesticides and chemicals. Always read and strictly follow the manufacturer's label instructions, safety precautions, and usage guidelines. You are responsible for ensuring that you are legally permitted to purchase and use the Products in your specific location and for your intended purpose. We are not liable for misuse, improper application, failure to follow instructions, or non-compliance with regulations.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">3. User Accounts</h2>
        <p className="mb-3">
          You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">4. Purchases and Payment</h2>
        <p className="mb-3">
          We accept the following forms of payment: PhonePe, Razorpay. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. Sales tax or other applicable taxes (like GST in India) will be added to the price of purchases as deemed required by us or law. All payments shall be in Indian Rupees (INR).
        </p>
        <p className="mb-3">
          We reserve the right to refuse any order placed through the Site. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">5. Shipping and Delivery</h2>
        <p className="mb-3">
          Please review our Shipping Policy, posted on the Site, which is incorporated into these Terms of Service. We are not responsible for delays caused by the shipping carrier or customs clearance (if applicable). Risk of loss and title for items purchased pass to you upon our delivery to the carrier.
        </p>
        <p className="mb-3">
          Shipping restrictions may apply to certain Products (e.g., hazardous materials, pesticides) based on destination and regulations. It is your responsibility to ensure compliance.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">6. Refund Policy</h2>
        <p className="mb-3">
          Please review our Refund Policy, posted on the Site. Due to the nature of our products, sales are generally considered final after payment and shipment, subject to limited exceptions outlined in the Refund Policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">7. Intellectual Property Rights</h2>
        <p className="mb-3">
          Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">8. Prohibited Activities</h2>
        <p className="mb-3">
          You may not access or use the Site for any purpose other than that for which we make the Site available. Prohibited activities include, but are not limited to: systematic retrieval of data, unauthorized framing or linking, interfering with security features, attempting to impersonate another user, using the Site for illegal purposes, or disparaging or harming us or the Site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">9. Disclaimers & Limitation of Liability</h2>
        <p className="mb-3">
          THE SITE AND PRODUCTS ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p className="mb-3 font-semibold text-red-600">
          WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SITE’S CONTENT OR THE CONTENT OF ANY WEBSITES LINKED TO THE SITE. WE ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SITE OR PRODUCTS (INCLUDING DAMAGES FROM MISUSE, IMPROPER APPLICATION, OR FAILURE TO FOLLOW SAFETY GUIDELINES FOR PESTICIDES AND CHEMICALS), (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SITE, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SITE BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SITE.
        </p>
        <p className="mb-3">
          OUR LIABILITY SHALL BE LIMITED TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, AND IN NO EVENT SHALL OUR AGGREGATE LIABILITY EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR THE PRODUCTS GIVING RISE TO THE CLAIM.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">10. Indemnification</h2>
        <p className="mb-3">
          You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third party due to or arising out of: (1) your use of the Site or Products; (2) breach of these Terms of Service; (3) any breach of your representations and warranties set forth in these Terms of Service (especially regarding compliance and safe use); (4) your violation of the rights of a third party, including but not limited to intellectual property rights; or (5) any overt harmful act toward any other user of the Site with whom you connected via the Site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">11. Governing Law</h2>
        <p className="mb-3">
          These Terms of Service and your use of the Site are governed by and construed in accordance with the laws of India, applicable to agreements made and to be entirely performed within India, without regard to its conflict of law principles. Any legal action or proceeding shall be brought exclusively in the courts located in Pune, Maharashtra, India.
        </p>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">12. Contact Us</h2>
        <p>
          In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
          <br />
          StarFarmer
          <br />
          Agri Tech Park, Pune
          <br />
          Email: contact@starfarmer.com
          <br />
          Phone: +91 7558332323
        </p>
      </section>
    </main>
  );
};

export default TermsOfService;

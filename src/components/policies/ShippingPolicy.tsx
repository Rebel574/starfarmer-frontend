import { useEffect } from 'react';

const ShippingPolicy = () => {
  const lastUpdated = 'April 14, 2025';
  const processingTime = '1-3 business days';
  const contactWithinDaysDamage = 3;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main className="bg-white text-gray-800 p-6 md:p-10 max-w-4xl mx-auto my-8 rounded-lg shadow-md">
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-6 border-b pb-3">
        Shipping Policy
      </h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: {lastUpdated}</p>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">1. Order Processing Time</h2>
        <p className="mb-3">
          All orders are processed within <strong className="text-green-700">{processingTime}</strong> (excluding weekends and public holidays) after receiving your order confirmation email and successful payment verification. You will receive another notification when your order has shipped.
        </p>
        <p>
          Processing times may be longer during periods of high volume or due to unforeseen circumstances. We will notify you if there is a significant delay in processing your order.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">2. Shipping Methods and Costs (India Domestic)</h2>
        <p className="mb-3">
          We offer shipping across India. Shipping charges for your order will be calculated and displayed at checkout based on the weight of the items, dimensions, and the delivery location.
        </p>
        <p className="mb-3">
          We partner with reputable courier services such as [List your primary carriers, e.g., Delhivery, Blue Dart, DTDC, India Post] to deliver your orders safely and efficiently. The specific carrier for your order will be chosen based on your location and the nature of the products (e.g., regulations for shipping chemicals).
        </p>
        {/* Optional: Add if you offer free shipping */}
        {/*
        <p className="mb-3">
          We offer free standard shipping for orders over ₹[Amount].
        </p>
        */}
         <p>
           Currently, we only ship within India. We do not offer international shipping.
         </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">3. Estimated Delivery Time</h2>
        <p className="mb-3">
          Once shipped, estimated delivery times are typically:
        </p>
         <ul className="list-disc list-inside mb-3 space-y-2 pl-4">
            <li>Metro Cities: 4-6 business days</li>
            <li>Tier II/III Cities: 5-9 business days</li>
            <li>Remote Areas / Special Zones (e.g., Northeast, J&K): 7-12 business days</li>
         </ul>
        <p className="mb-3">
          Please note that these are estimates only and actual delivery times may vary due to factors beyond our control, such as:
        </p>
        <ul className="list-disc list-inside mb-3 space-y-1 pl-4 text-sm">
            <li>Shipping carrier delays</li>
            <li>Weather conditions</li>
            <li>Festivals and public holidays</li>
            <li>Logistical challenges in certain areas</li>
            <li>Regulatory checks for specific product types (e.g., pesticides)</li>
        </ul>
         <p>
          We are not liable for delays caused by the courier service or unforeseen circumstances.
        </p>
      </section>

       <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">4. Shipping Restrictions & Compliance</h2>
        <p className="mb-3 font-semibold text-red-600">
          Important: Certain products, particularly pesticides, restricted chemicals, or bulky items, may have shipping restrictions based on state regulations, local laws, or courier policies.
        </p>
         <ul className="list-disc list-inside mb-3 space-y-2 pl-4">
           <li>We reserve the right to cancel orders or request additional information/documentation if delivery to a specific location is prohibited or requires special permits.</li>
           <li>It is **your responsibility** to ensure that you are legally allowed to receive and possess the products ordered at your shipping address according to local laws.</li>
           <li>We may not be able to ship certain hazardous materials to all locations or via all shipping methods (e.g., air freight restrictions).</li>
           <li>We generally do not ship to P.O. Boxes, especially for regulated goods. Please provide a complete physical address.</li>
         </ul>
      </section>

       <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">5. Order Tracking</h2>
        <p className="mb-3">
          Once your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 24-48 hours for the tracking information to become available on the carrier's website.
        </p>
        <p>
          You can track your order via the link provided in the email or directly on the courier partner's website using the tracking number.
        </p>
      </section>

       <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">6. Shipment Confirmation & Delivery</h2>
        <p className="mb-3">
          Ensure your shipping address is complete and accurate. We are not responsible for non-delivery due to incorrect or incomplete addresses provided by the customer. If a package is returned to us due to an incorrect address, additional shipping charges may apply to reship the order.
        </p>
        <p>
          Some deliveries may require a signature upon receipt, especially for high-value orders or regulated products.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">7. Damaged or Lost Packages</h2>
        <p className="mb-3">
          If your order arrives damaged, please refer to our Refund Policy. Contact us within <strong className="text-red-600">{contactWithinDaysDamage} days</strong> of delivery with your order number and photographic evidence of the damage. We will work with you and the carrier to resolve the issue.
        </p>
        <p>
           If your order tracking shows delivered, but you haven't received it, please first check with neighbours or building security. If it's still missing, contact us within 2 days of the indicated delivery date. We will initiate an investigation with the courier partner. Please note that investigations can take time, and we cannot guarantee a replacement or refund for packages confirmed as delivered by the carrier to the correct address.
        </p>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">8. Contact Us</h2>
         <p>
          If you have any further questions about shipping, please don't hesitate to contact us:
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

export default ShippingPolicy;
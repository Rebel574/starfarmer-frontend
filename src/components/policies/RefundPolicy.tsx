import { useEffect } from 'react';

const RefundPolicy = () => {
  const lastUpdated = 'April 14, 2025';
  const contactWithinDays = 3;
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

  return (
    <main className="bg-white text-gray-800 p-6 md:p-10 max-w-4xl mx-auto my-8 rounded-lg shadow-md">
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-6 border-b pb-3">
        Refund Policy
      </h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: {lastUpdated}</p>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">1. General Policy</h2>
        <p className="mb-3">
          Thank you for shopping at StarFarmer. Due to the nature of our products—including agricultural inputs like medicines, pesticides, fertilizers, and seeds, which may be perishable, regulated, or have specific storage requirements—<strong>all sales are considered final upon payment and shipment.</strong>
        </p>
        <p className="mb-3 font-semibold">
          We generally do not offer refunds or accept returns once an order has been processed and shipped, except under specific circumstances outlined below. Please ensure you select the correct products before completing your purchase.
        </p>
        <p>
          This policy reflects the need to maintain product integrity and comply with regulations regarding agricultural inputs.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">2. Exceptions (Limited Circumstances for Refund/Replacement)</h2>
        <p className="mb-3">
          Refunds or replacements may be considered only under the following limited conditions, at our sole discretion:
        </p>
        <ul className="list-disc list-inside mb-3 space-y-2 pl-4">
          <li>
            <strong>Damaged Products:</strong> If you receive a product that is physically damaged during transit (e.g., broken container or significant leakage affecting usability), please contact us within <strong className="text-red-600">{contactWithinDays} days</strong> of delivery. You must provide clear photographic evidence of the damage to both the product and the packaging. We will assess the situation and may offer a replacement of the same item or, in rare cases, a refund if a replacement is not feasible.
          </li>
          <li>
            <strong>Incorrect Product Shipped:</strong> If you receive a product different from what you ordered (as confirmed by your order confirmation), please contact us within <strong className="text-red-600">{contactWithinDays} days</strong> of delivery. Do not open or use the incorrect product. We will arrange the return of the incorrect item (at our expense) and ship the correct item, or offer a refund if the correct item is unavailable. You must provide proof of the incorrect item received (e.g., a photo).
          </li>
        </ul>
        <p>
          Any claims made after the specified timeframe (<strong className="text-red-600">{contactWithinDays} days</strong> from delivery) will not be eligible for consideration.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">3. Non-Refundable / Non-Returnable Items</h2>
        <p className="mb-3">
          Except for the specific exceptions listed above, the following items are strictly non-refundable and non-returnable:
        </p>
        <ul className="list-disc list-inside mb-3 space-y-2 pl-4">
          <li>Products that have been opened, used, or tampered with.</li>
          <li>Seeds (due to viability concerns once the packaging is opened or handled improperly).</li>
          <li>Pesticides, fertilizers, and medicines where the seal is broken or packaging is compromised (unless damaged in transit as described in Section 2).</li>
          <li>Products damaged due to customer mishandling, improper storage, or misuse after delivery.</li>
          <li>Products for which a return/refund request is made after the stipulated timeframe (<strong className="text-red-600">{contactWithinDays} days</strong> from delivery).</li>
          <li>Orders where the customer provided an incorrect shipping address resulting in non-delivery or return.</li>
          <li>Dissatisfaction with product efficacy (as performance can depend on various factors beyond our control such as application method, weather, soil conditions, pest resistance, etc.). Please follow the manufacturer's guidelines strictly.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">4. Process for Requesting Refund/Replacement (Under Exceptions)</h2>
        <p className="mb-3">
          To request a refund or replacement under the eligible exceptions (Section 2):
        </p>
        <ol className="list-decimal list-inside mb-3 space-y-2 pl-4">
          <li>Contact our Customer Service within <strong className="text-red-600">{contactWithinDays} days</strong> of receiving your order via email at <strong>payment@starfarmer.com</strong> or phone at <strong>+91 7558332323</strong>.</li>
          <li>Provide your order number and a detailed explanation of the issue.</li>
          <li>Include clear photographic evidence supporting your claim (e.g., damage or incorrect item).</li>
          <li>Do not discard the item or packaging until instructed, as we may require it for verification or return.</li>
          <li>We will review your request and evidence and respond within 3–5 business days with a decision and further instructions, if applicable.</li>
        </ol>
        <p>
          Approved refunds will be processed back to the original payment method within 7–10 business days after approval (and receipt of the returned item, if required). Replacements will be shipped according to our standard shipping timelines.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">5. Discretion</h2>
        <p className="mb-3">
          StarFarmer reserves the right to refuse any refund or replacement request if it does not meet the conditions outlined in this policy or if fraudulent activity is suspected. All decisions regarding refunds and replacements are made at our sole discretion.
        </p>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3">6. Contact Us</h2>
        <p>
          If you have any questions about our Refund Policy, please contact us:
          <br />
          <strong>StarFarmer</strong>
          <br />
          Agri Tech Park, Pune
          <br />
          Email: <strong>payment@starfarmer.com</strong>
          <br />
          Phone: <strong>+91 7558332323</strong>
        </p>
      </section>
    </main>
  );
};

export default RefundPolicy;

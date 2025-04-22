import React, { useState ,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
// Define a specific type for the submission status
type SubmissionStatus = 'success' | 'error' | null;

// Define an interface or type for formData for better type safety
interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    queryType: string;
    orderNumber: string;
    bulkOrderDetails: string;
    productIssueDetails: string;
}


const ContactUs: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [queryType, setQueryType] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>(''); // For order-related queries
  const [bulkOrderDetails, setBulkOrderDetails] = useState<string>(''); // For bulk order inquiries
  const [productIssueDetails, setProductIssueDetails] = useState<string>(''); // For product issues
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(null); // Use the defined type
  const [submissionMessage, setSubmissionMessage] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleQueryTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryType(event.target.value);
    // Reset specific details when query type changes
    setOrderNumber('');
    setBulkOrderDetails('');
    setProductIssueDetails('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionStatus(null);
    setSubmissionMessage('');

    const formData: FormData = {
      name,
      email,
      subject: queryType ? `${t('contactUs.queryTypePrefix')} ${t(`contactUs.queryTypes.${queryType}`)} - ${subject}` : subject,
      message,
      queryType,
      orderNumber,
      bulkOrderDetails,
      productIssueDetails,
    };

    // Simulate API call
    try {
      console.log('Form Data Submitted:', formData);
      // Replace with your actual API endpoint call
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error('Network response was not ok');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      setSubmissionStatus('success');
      setSubmissionMessage(t('contactUs.submissionSuccess'));
      // Reset form fields after successful submission
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setQueryType('');
      setOrderNumber('');
      setBulkOrderDetails('');
      setProductIssueDetails('');
    } catch (error) {
      console.error('Submission Error:', error);
      setSubmissionStatus('error');
      setSubmissionMessage(t('contactUs.submissionError'));
    }
  };

  // Base input field classes for consistency
  const inputBaseClasses = "block w-full px-3 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out";
  const labelBaseClasses = "block text-sm font-medium text-gray-700";

  return (
    // --- Main Container Styling ---
    // Increased padding, added background, rounded corners, and shadow for definition
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-lg">

      {/* --- Title Styling --- */}
      {/* Centered text, slightly softer color, increased bottom margin */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {t('contactUs.title')}
      </h2>

      {/* --- Form Styling --- */}
      {/* Increased spacing between form elements */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* --- Name Field --- */}
        <div>
          <label htmlFor="name" className={labelBaseClasses}>
            {t('contactUs.name')} <span className="text-red-500">*</span> {/* Added asterisk for required */}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className={inputBaseClasses}
            required
            aria-required="true" // Added aria-required for accessibility
          />
        </div>

        {/* --- Email Field --- */}
        <div>
          <label htmlFor="email" className={labelBaseClasses}>
            {t('contactUs.email')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className={inputBaseClasses}
            required
            aria-required="true"
          />
        </div>

        {/* --- Query Type Field --- */}
        <div>
          <label htmlFor="queryType" className={labelBaseClasses}>
            {t('contactUs.queryType')}
          </label>
          <select
            id="queryType"
            value={queryType}
            onChange={handleQueryTypeChange}
            className={`${inputBaseClasses} appearance-none`} // Added appearance-none for custom arrow potentially
          >
            <option value="">{t('contactUs.selectQueryType')}</option>
            <option value="general">{t('contactUs.queryTypes.general')}</option>
            <option value="bulkOrder">{t('contactUs.queryTypes.bulkOrder')}</option>
            <option value="orderIssue">{t('contactUs.queryTypes.orderIssue')}</option>
            <option value="productIssue">{t('contactUs.queryTypes.productIssue')}</option>
          </select>
           {/* Consider adding a custom dropdown arrow if needed */}
        </div>

        {/* --- Conditional: Order Issue Field --- */}
        {queryType === 'orderIssue' && (
          <div>
            <label htmlFor="orderNumber" className={labelBaseClasses}>
              {t('contactUs.orderNumber')} <span className="text-red-500">*</span> {/* Assuming required */}
            </label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderNumber(e.target.value)}
              className={inputBaseClasses}
              required={queryType === 'orderIssue'} // Conditionally required
              aria-required={queryType === 'orderIssue'}
            />
          </div>
        )}

        {/* --- Conditional: Bulk Order Field --- */}
        {queryType === 'bulkOrder' && (
          <div>
            <label htmlFor="bulkOrderDetails" className={labelBaseClasses}>
              {t('contactUs.bulkOrderDetails')} <span className="text-red-500">*</span> {/* Assuming required */}
            </label>
            <textarea
              id="bulkOrderDetails"
              rows={4} // Slightly increased rows
              value={bulkOrderDetails}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBulkOrderDetails(e.target.value)}
              className={inputBaseClasses}
              placeholder={t('contactUs.bulkOrderPlaceholder')}
              required={queryType === 'bulkOrder'} // Conditionally required
              aria-required={queryType === 'bulkOrder'}
            />
          </div>
        )}

        {/* --- Conditional: Product Issue Field --- */}
        {queryType === 'productIssue' && (
          <div>
            <label htmlFor="productIssueDetails" className={labelBaseClasses}>
              {t('contactUs.productIssueDetails')} <span className="text-red-500">*</span> {/* Assuming required */}
            </label>
            <textarea
              id="productIssueDetails"
              rows={4} // Slightly increased rows
              value={productIssueDetails}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProductIssueDetails(e.target.value)}
              className={inputBaseClasses}
              placeholder={t('contactUs.productIssuePlaceholder')}
              required={queryType === 'productIssue'} // Conditionally required
              aria-required={queryType === 'productIssue'}
            />
          </div>
        )}

        {/* --- Subject Field --- */}
        <div>
          <label htmlFor="subject" className={labelBaseClasses}>
            {t('contactUs.subject')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
            className={inputBaseClasses}
            required
            aria-required="true"
          />
        </div>

        {/* --- Message Field --- */}
        <div>
          <label htmlFor="message" className={labelBaseClasses}>
            {t('contactUs.message')} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            className={inputBaseClasses}
            required
            aria-required="true"
          />
        </div>

        {/* --- Submission Status Messages --- */}
         {/* Moved status messages before the button for better flow */}
        <div className="mt-4">
          {submissionStatus === 'success' && (
            // --- Success Message Styling ---
            // Added padding, background, border, rounded corners
            <div className="p-3 rounded-md bg-green-50 border border-green-200" role="alert">
              <p className="text-sm font-medium text-green-700">{submissionMessage}</p>
            </div>
          )}

          {submissionStatus === 'error' && (
             // --- Error Message Styling ---
             // Added padding, background, border, rounded corners
            <div className="p-3 rounded-md bg-red-50 border border-red-200" role="alert">
              <p className="text-sm font-medium text-red-700">{submissionMessage}</p>
            </div>
          )}
        </div>

        {/* --- Submit Button --- */}
        <div className="pt-2"> {/* Added slight padding top */}
          <button
            type="submit"
            // --- Button Styling ---
            // Slightly larger padding, full width on small screens, transitions
            className="w-full sm:w-auto inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50"
            // disabled={submissionStatus === 'submitting'} // Optional: Disable during submission
          >
            {t('contactUs.submit')}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ContactUs;
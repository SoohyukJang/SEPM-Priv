import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="py-8 px-6 sm:p-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
          
          <p className="text-lg text-gray-500 mb-8 pb-6 border-b border-gray-200">
            Last updated: March 9, 2025
          </p>
          
          <div className="prose prose-green max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              At NutriGen Bot, we respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you use our website, mobile application, or any other services we offer (collectively, the "Services").
            </p>
            <p className="text-gray-600 mb-6">
              Please read this Privacy Policy carefully. By using our Services, you agree to the collection and use
              of information in accordance with this policy.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect several types of information from and about users of our Services:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-600 mb-4">
              Personal Information is information that identifies you as an individual. When you use our Services,
              we may collect the following Personal Information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li className="mb-2">Name</li>
              <li className="mb-2">Email address</li>
              <li className="mb-2">Password</li>
              <li className="mb-2">Profile information</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Health Information</h3>
            <p className="text-gray-600 mb-4">
              To provide you with personalized nutrition recommendations, we may collect health-related information, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li className="mb-2">Height and weight</li>
              <li className="mb-2">Age and gender</li>
              <li className="mb-2">Activity level</li>
              <li className="mb-2">Health goals (e.g., weight loss, maintenance, gain)</li>
              <li className="mb-2">Food allergies and dietary restrictions</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.3 Usage Data</h3>
            <p className="text-gray-600 mb-4">
              We may also collect information about how you access and use our Services, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li className="mb-2">Log data (e.g., IP address, browser type, pages visited)</li>
              <li className="mb-2">Device information (e.g., device type, operating system)</li>
              <li className="mb-2">Usage patterns (e.g., features used, recipe searches)</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li className="mb-2">Provide, maintain, and improve our Services</li>
              <li className="mb-2">Create and manage your account</li>
              <li className="mb-2">Provide personalized recipe recommendations based on your health profile</li>
              <li className="mb-2">Process and respond to your requests, inquiries, and feedback</li>
              <li className="mb-2">Communicate with you about our Services, including updates and new features</li>
              <li className="mb-2">Monitor and analyze trends, usage, and activities in connection with our Services</li>
              <li className="mb-2">Detect, prevent, and address technical issues or fraudulent activities</li>
              <li className="mb-2">Comply with legal obligations</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. How We Share Your Information</h2>
            <p className="text-gray-600 mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li className="mb-2">
                <strong>Service Providers:</strong> We may share your information with third-party service providers who
                help us operate our Services, such as hosting providers, analytics providers, and payment processors.
              </li>
              <li className="mb-2">
                <strong>Legal Compliance:</strong> We may disclose your information if required to do so by law or in response
                to valid requests by public authorities (e.g., a court or government agency).
              </li>
              <li className="mb-2">
                <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion
                of our assets, your information may be transferred as part of that transaction.
              </li>
              <li className="mb-2">
                <strong>With Your Consent:</strong> We may share your information with third parties when we have your consent to do so.
              </li>
            </ul>
            <p className="text-gray-600 mb-6">
              We do not sell your personal information to third parties for marketing purposes.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational measures to protect your personal data against accidental
              or unlawful destruction, loss, alteration, unauthorized disclosure, or access. However, no method of transmission
              over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              Depending on your location, you may have certain rights regarding your personal data, such as:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li className="mb-2">The right to access your personal data</li>
              <li className="mb-2">The right to rectify inaccurate or incomplete personal data</li>
              <li className="mb-2">The right to delete your personal data</li>
              <li className="mb-2">The right to restrict or object to processing of your personal data</li>
              <li className="mb-2">The right to data portability</li>
              <li className="mb-2">The right to withdraw consent</li>
            </ul>
            <p className="text-gray-600 mb-6">
              To exercise any of these rights, please contact us using the information provided at the end of this policy.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Cookies and Similar Technologies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar tracking technologies to track activity on our Services and hold certain information.
              Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </p>
            <p className="text-gray-600 mb-6">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
              if you do not accept cookies, you may not be able to use some portions of our Services.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-600 mb-6">
              Our Services are not directed to children under 13 years of age, and we do not knowingly collect personal information
              from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps
              to delete such information as soon as possible.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-600 mb-4">
              Your information may be transferred to and maintained on computers located outside of your state, province, country,
              or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.
            </p>
            <p className="text-gray-600 mb-6">
              If you are located outside Vietnam and choose to provide information to us, please note that we transfer
              the data to Vietnam and process it there. Your consent to this Privacy Policy followed by your submission
              of such information represents your agreement to that transfer.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy
              on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
            <p className="text-gray-600 mb-6">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective
              when they are posted on this page.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li className="mb-2">By email: <a href="mailto:privacy@nutrigenbot.com" className="text-green-600 hover:text-green-700">privacy@nutrigenbot.com</a></li>
              <li className="mb-2">By mail: RMIT Vietnam, 702 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam</li>
            </ul>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

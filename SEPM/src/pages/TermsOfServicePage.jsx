import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="py-8 px-6 sm:p-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
          
          <p className="text-lg text-gray-500 mb-8 pb-6 border-b border-gray-200">
            Last updated: March 9, 2025
          </p>
          
          <div className="prose prose-green max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Welcome to NutriGen Bot ("we," "our," or "us"). By accessing or using our website, mobile application,
              or any other services we offer (collectively, the "Services"), you agree to be bound by these Terms of Service.
            </p>
            <p className="text-gray-600 mb-6">
              Please read these Terms carefully. If you do not agree with these Terms, you should not use our Services.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Eligibility</h2>
            <p className="text-gray-600 mb-6">
              You must be at least 13 years old to use our Services. By using our Services, you represent and warrant that you
              meet this requirement. If you are under 18, you represent that you have your parent or guardian's permission to use the Services.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Account Registration</h2>
            <p className="text-gray-600 mb-4">
              To use certain features of our Services, you may need to register for an account. When you register, you agree to provide accurate,
              current, and complete information about yourself and to update this information to keep it accurate, current, and complete.
            </p>
            <p className="text-gray-600 mb-6">
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us
              immediately of any unauthorized use of your account.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. User Content</h2>
            <p className="text-gray-600 mb-4">
              Our Services may allow you to post, upload, or submit content, such as comments, reviews, or blog posts ("User Content").
              You retain ownership of your User Content, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce,
              modify, adapt, publish, translate, create derivative works from, distribute, and display your User Content in connection with the Services.
            </p>
            <p className="text-gray-600 mb-4">
              You are solely responsible for your User Content. By posting User Content, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li className="mb-2">You own or have the necessary rights to use and authorize us to use your User Content</li>
              <li className="mb-2">Your User Content does not violate the rights of any third party</li>
              <li className="mb-2">Your User Content complies with these Terms and all applicable laws</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Prohibited Conduct</h2>
            <p className="text-gray-600 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li className="mb-2">Use the Services in any manner that could disable, overburden, damage, or impair the Services</li>
              <li className="mb-2">Use any robot, spider, or other automated device to access the Services</li>
              <li className="mb-2">Introduce any viruses, Trojan horses, worms, logic bombs, or other harmful material</li>
              <li className="mb-2">Attempt to gain unauthorized access to any part of the Services</li>
              <li className="mb-2">Use the Services for any illegal or unauthorized purpose</li>
              <li className="mb-2">Post any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 mb-6">
              The Services and all content and materials included on the Services, such as text, graphics, logos, images, and software,
              are the property of NutriGen Bot or our licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-4">
              THE SERVICES ARE PROVIDED "AS IS" AND WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              TITLE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-gray-600 mb-4">
              WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED,
              OR THAT THE SERVICES ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
            <p className="text-gray-600 mb-6">
              NUTRIGEN BOT IS NOT A MEDICAL OR HEALTHCARE PROVIDER, AND THE SERVICES ARE NOT INTENDED TO DIAGNOSE, TREAT, CURE,
              OR PREVENT ANY DISEASE OR HEALTH CONDITION. THE INFORMATION PROVIDED THROUGH THE SERVICES IS FOR INFORMATIONAL
              PURPOSES ONLY AND IS NOT INTENDED AS A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NUTRIGEN BOT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION
              WITH THESE TERMS OR YOUR USE OF THE SERVICES.
            </p>
            <p className="text-gray-600 mb-6">
              IN NO EVENT WILL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED THE AMOUNT PAID BY YOU, IF ANY,
              FOR ACCESSING OR USING THE SERVICES DURING THE TWELVE (12) MONTHS PRIOR TO THE CLAIM.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Indemnification</h2>
            <p className="text-gray-600 mb-6">
              You agree to indemnify, defend, and hold harmless NutriGen Bot and its officers, directors, employees, agents, and affiliates
              from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees)
              that arise from or relate to your use of the Services or violation of these Terms.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability,
              for any reason whatsoever, including without limitation if you breach these Terms.
            </p>
            <p className="text-gray-600 mb-6">
              All provisions of these Terms which by their nature should survive termination shall survive termination,
              including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We may revise these Terms at any time by updating this page. By continuing to access or use our Services after those
              revisions become effective, you agree to be bound by the revised Terms.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These Terms shall be governed by and construed in accordance with the laws of Vietnam, without regard to
              its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact Us</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about these Terms, please contact us at <a href="mailto:support@nutrigenbot.com" className="text-green-600 hover:text-green-700">support@nutrigenbot.com</a>.
            </p>
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

export default TermsOfServicePage;

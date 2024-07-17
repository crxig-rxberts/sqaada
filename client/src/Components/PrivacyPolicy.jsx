import React from 'react';
import PolicySection from './PolicySection';
import Card from './Card';

const PrivacyPolicy = () => {
  const policySections = [
    {
      title: '1. Introduction',
      content: 'Welcome to ToDo App. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.'
    },
    {
      title: '2. Data We Collect',
      content: (
        <>
          <p>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
          <ul>
            <li>Identity Data: first name, last name, username</li>
            <li>Contact Data: email address</li>
            <li>Technical Data: internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform</li>
            <li>Usage Data: information about how you use our website and service</li>
          </ul>
        </>
      )
    },
    {
      title: '3. How We Use Your Data',
      content: (
        <>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </>
      )
    },
    {
      title: '4. Data Security',
      content: 'We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.'
    },
    {
      title: '5. Your Legal Rights',
      content: (
        <>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
          <ul>
            <li>Request access to your personal data</li>
            <li>Request correction of your personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
            <li>Request transfer of your personal data</li>
            <li>Right to withdraw consent</li>
          </ul>
        </>
      )
    },
    {
      title: '6. Contact Us',
      content: (
        <>
          <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
          <p>Email: privacy@todoapp.com</p>
          <p>Address: 123 Todo Street, App City, TC 12345, Country</p>
        </>
      )
    }
  ];

  return (
    <div className="container py-5">
      <h1 className="display-4 text-center mb-5">Privacy Policy</h1>
      <Card>
        {policySections.map((section, index) => (
          <PolicySection key={index} title={section.title} content={section.content} />
        ))}
        <p className="mt-5">Last updated: July 08, 2024</p>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
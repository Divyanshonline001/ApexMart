import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiShield, FiEye, FiMail } from 'react-icons/fi';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="container section-padding" style={{ paddingTop: '40px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
          <FiArrowLeft /> Go Back
        </button>
      </div>

      <div className="admin-card" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-light)', color: 'var(--accent)', borderRadius: 'var(--radius-md)', fontSize: '1.5rem' }}>
            <FiShield />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Privacy Policy</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Last updated: August 11, 2026</p>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '30px' }}>
          At ApexMart, we value and respect your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '30px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', marginBottom: '12px' }}>
              <FiEye style={{ color: 'var(--accent)' }} /> 1. Information We Collect
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '10px' }}>
              We collect information that you provide directly to us when registering an account, placing an order, subscribing to our newsletter, or contacting customer support:
            </p>
            <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Personal Data:</strong> Name, shipping address, billing address, email address, telephone number, and payment preferences.</li>
              <li><strong>Order History:</strong> Details of items purchased, prices, dates of purchase, and delivery status.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, operating system, and interaction details on our site.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', marginBottom: '12px' }}>
              <FiLock style={{ color: 'var(--accent)' }} /> 2. How We Use Your Information
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '10px' }}>
              We process your personal information to fulfill contract obligations, manage account operations, and offer you the best shopping experience:
            </p>
            <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>To process and deliver your orders, including sending order updates and invoices.</li>
              <li>To manage your account registrations, details, and security profiles.</li>
              <li>To enhance the responsiveness, reliability, and security of our online platform.</li>
              <li>To provide customer support and troubleshoot potential catalog or cart discrepancies.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', marginBottom: '12px' }}>
              <FiShield style={{ color: 'var(--accent)' }} /> 3. Data Protection & Security
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              We implement comprehensive technical and organizational security measures (including secure session auth, password hashing, and HTTPS) to protect the confidentiality and integrity of your personal information. However, please be aware that no security system is completely impenetrable.
            </p>
          </section>

          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', marginBottom: '12px' }}>
              <FiMail style={{ color: 'var(--accent)' }} /> 4. Contact Us
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              If you have any questions or concerns regarding this Privacy Policy or how we handle your personal data, feel free to contact our data privacy officer at:
              <br />
              <strong style={{ display: 'block', marginTop: '10px', color: 'var(--secondary)' }}>
                Email: privacy@apexmart.com
                <br />
                Address: 123 MG Road, Sector 5, Mumbai, Maharashtra 400001
              </strong>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

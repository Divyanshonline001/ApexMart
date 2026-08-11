import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFileText, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const TermsConditions = () => {
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
            <FiFileText />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Terms & Conditions</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Last updated: August 11, 2026</p>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '30px' }}>
          Welcome to ApexMart. These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to be bound by these terms. If you do not agree with any part of these terms and conditions, you must not use our website.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '30px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', marginBottom: '12px' }}>
              <FiInfo style={{ color: 'var(--accent)' }} /> 1. Account Registration & Security
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              To access certain features of the site (such as order tracking or history), you may be required to register an account. You agree to provide accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your username and password, and you accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', marginBottom: '12px' }}>
              <FiCheckCircle style={{ color: 'var(--accent)' }} /> 2. Products, Pricing & Orders
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '10px' }}>
              All products listed on the website are subject to availability. We reserve the right to limit the quantity of any product we offer or decline any order.
            </p>
            <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Pricing:</strong> Prices are displayed in INR (₹) and include applicable discounts. Prices are subject to change without notice.</li>
              <li><strong>Order Validation:</strong> Placing an order represents an offer to purchase. Order acceptance is confirmed only when dispatch or processing stages begin.</li>
              <li><strong>Payments:</strong> We currently support Cash on Delivery (COD) as the default payment method. Payment is due upon physical delivery of the products.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', marginBottom: '12px' }}>
              <FiAlertCircle style={{ color: 'var(--accent)' }} /> 3. Shipping, Cancellations & Returns
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '10px' }}>
              We strive to process and dispatch all confirmed orders promptly:
            </p>
            <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Shipping:</strong> Standard shipping takes 3-5 business days. Shipping is free for orders over ₹1500; otherwise, a flat fee of ₹150 applies.</li>
              <li><strong>Cancellations:</strong> You can cancel your order at any stage before it is marked as "Shipped" or "Delivered".</li>
              <li><strong>Returns:</strong> Items can be returned within 7 days of delivery, provided they are in their original packaging and unused condition.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', marginBottom: '12px' }}>
              <FiFileText style={{ color: 'var(--accent)' }} /> 4. Intellectual Property & Limitations
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              All content on this website (including text, graphics, logos, images, and software) is the property of ApexMart or its content suppliers and is protected by copyright laws. We shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use of our products or online services.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsConditions;

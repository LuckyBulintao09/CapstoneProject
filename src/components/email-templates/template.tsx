import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  status: string; 
  reason?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  status,
  reason,
}) => (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: '5px',
      maxWidth: '600px',
      margin: '20px auto',
    }}
  >
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h1 style={{ color: '#ff4d4d' }}>Hello, {firstName} {lastName}!</h1>
      <p
        style={{
          fontSize: '18px',
          color: status === 'approved' ? '#28a745' : '#ff4d4d',
        }}
      >
        {status === 'approved'
          ? 'Congratulations! Your application to Unihomes has been approved.'
          : 'Unfortunately, your application to Unihomes has been rejected.'}
      </p>
    </div>
    <div
      style={{
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <p
        style={{
          fontSize: '16px',
          color: '#333',
          textAlign: 'center',
        }}
      >
        {status === 'approved'
          ? 'We are excited to have you onboard. Please check your account for further details.'
          : 'We regret to inform you that you did not meet the criteria for acceptance.'}
        <br />
        {status === 'rejected' && reason && (
          <p style={{ fontSize: '16px', color: '#ff4d4d', marginTop: '10px' }}>
            Reason for rejection: <strong>{reason}</strong>
          </p>
        )}
        <br />
        If you have any questions or would like feedback, please don't hesitate to
        reach out to us. We wish you the best in your future endeavors!
      </p>
    </div>
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <p
        style={{
          fontSize: '14px',
          color: '#999',
        }}
      >
        Thank you for your interest in Unihomes.
      </p>
      <p
        style={{
          fontSize: '12px',
          color: '#bbb',
        }}
      >
        &copy; {new Date().getFullYear()} Unihomes. All rights reserved.
      </p>
    </div>
  </div>
);

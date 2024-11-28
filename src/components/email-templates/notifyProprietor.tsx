import React from 'react';

type EmailTemplateProps = {
  message: string;
};

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ message }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', color: '#333' }}>
      <p>{message}</p>
    </div>
  );
};

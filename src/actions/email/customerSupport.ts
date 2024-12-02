"use server";
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

interface CustomerSupportParams {
  email: string;
}

export async function CustomerSupport({ email }: CustomerSupportParams) {
  try {
    const message = `${email} has requested customer support`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Customer Support Request</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background: #fff;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .header {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .message {
              font-size: 16px;
              margin: 20px 0;
            }
            .footer {
              font-size: 14px;
              color: #666;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Customer Support Request</div>
            <div class="message">
              Hello,<br /><br />
              ${message}.
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Unihomes <noreply@unihomes.site>',
      to: email,
      subject: 'Unihomes Customer Support Request',
      html: htmlContent, 
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to send email: ${error}`);
  }
}

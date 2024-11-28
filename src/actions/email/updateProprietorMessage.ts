import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-templates/template';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

interface SendEmailParams {
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  reason?: string;  
}

export async function sendEmail({ email, firstName, lastName, status, reason }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Unihomes <noreply@unihomes.site>',
      to: email,
      subject: 'Proprietor Approval Status Update',
      react: EmailTemplate({ firstName, lastName, status, reason }), 
    });

    console.log("Email sent");

    if (error) {
      throw new Error(JSON.stringify(error));
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to send email: ${error}`);
  }
}



"use server";
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-templates/notifyProprietor';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

interface NotifyProprietorParams {
  subject: string;
  message: string;
  email: string;
}

export async function notifyProprietor({ email, subject, message }: NotifyProprietorParams) {
  try {
    const { data, error } = await resend.emails.send({
        from: 'Unihomes <noreply@unihomes.site>',
      to: email,
      subject: subject,
      react: EmailTemplate({ message }), 
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

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import spiels from '@/lib/constants/spiels';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner'; 
import { CustomerSupport } from '@/actions/email/customerSupport';

const CTA = () => {
  const [email, setEmail] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = async () => {
    if (!email.trim()) {
      toast.error('Email cannot be empty.'); 
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.'); 
      return;
    }

    setIsLoading(true);
    try {
      const response = await CustomerSupport({ email });
      toast.success('Customer Support Notified!'); 
      setEmail(''); 
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please try again later.'); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Separator className="w-full h-px bg-blue-500 opacity-30 mb-20" />
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl my-3 text-left lg:text-right dark:text-foreground">
            {spiels.CTA_LABEL}
          </h1>
          <p className="mb-8 max-w-3xl text-muted-foreground lg:text-lg">
            {spiels.CTA_DESCRIPTION.map((line, index) => (
              <span key={index}>
                {line}
                {index < spiels.CTA_DESCRIPTION.length - 1 && <br />}
              </span>
            ))}
          </p>
          <div className="w-full md:max-w-lg">
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Input
                placeholder="Enter your email"
                aria-label="Email Address"
                className="flex-1"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <Button
                className="flex-shrink-0"
                onClick={handleButtonClick}
                disabled={isLoading} 
              >
                {isLoading ? 'Sending...' : spiels.BUTTON_SUBSCRIBE} 
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

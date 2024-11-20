'use client';

import { useState } from 'react'; 
import { Button } from '@/components/ui/button';
import { LucideMessageCircle, Loader2 } from 'lucide-react'; 
import { contactProprietor } from '@/actions/chat/contactProprietor';

interface ContactProprietorButtonProps {
  ownerId: string;
}

const ContactProprietorButton: React.FC<ContactProprietorButtonProps> = ({ ownerId }) => {
  const [loading, setLoading] = useState(false); 

  const handleContactClick = async () => {
    setLoading(true); 
    try {
      const redirectUrl = await contactProprietor(ownerId); 
      window.location.href = redirectUrl; 
    } catch (error) {
      console.error('Error during contact click:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Button
      className='text-xs p-0 m-0 dark:text-blue-300'
      variant='link'
      onClick={handleContactClick}
      disabled={loading} 
    >
      {loading ? (
        <Loader2 className='mr-1 animate-spin' height={12} width={12} /> 
      ) : (
        <LucideMessageCircle className='mr-1' height={12} width={12} />
      )}
      {loading ? 'Loading...' : 'Contact Proprietor'} 
    </Button>
  );
};

export default ContactProprietorButton;

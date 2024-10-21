import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import spiels from '@/lib/constants/spiels';
import { sendMessage } from '@/app/serverActions/initiateConversation';

interface BannerProps {
  ownerName: string | undefined;
  ownerLastname: string | undefined;
  ownerId: string | undefined;
  companyId: string | undefined;
  companyName: string | undefined;
  propertyId: number | undefined;
}

const Banner: React.FC<BannerProps> = ({
  ownerName,
  ownerLastname,
  ownerId,
  companyId,
  companyName,
  propertyId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!ownerId || !propertyId) return;
    setIsLoading(true);
    try {
      await sendMessage(ownerId, propertyId);

    } catch (error) {

      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='col-span-8 mt-9'>
      <div className='flex flex-row justify-between bg-primary rounded-xl p-5'>
        <div className='flex flex-row items-center gap-3 '>
          <Avatar className='h-16 w-auto'>
            <AvatarImage src='https://github.com/shadcn.png' />
            <AvatarFallback>
              {ownerName?.charAt(0)}
              {ownerLastname?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <p className='text-xl leading-7 [&:not(:first-child)]:mt-6 text-primary-foreground'>
              {companyName}
            </p>
            <small className='text-sm text-primary-foreground'>
              {ownerName} {ownerLastname}
            </small>
            <small className='text-xs text-slate-400'>Company Manager</small>
          </div>
        </div>
        <div className='flex flex-row items-center gap-3'>
          <div className='flex flex-row gap-3'>
            <Button
              variant='outline'
              className='border-white text-white hover:bg-white hover:text-black'
              onClick={handleSendMessage}
              disabled={isLoading}
              aria-label="Message the owner"
            >
              <span className='flex flex-row items-center gap-1'>
                <MessageSquare className='w-5 h-5' />
                {isLoading ? 'Sending...' : spiels.BUTTON_MESSAGE}
              </span>
            </Button>

            <Button
              variant='secondary'
              className='bg-white text-black border border-white hover:bg-secondary dark:hover:bg-popover-foreground rounded-lg px-4 py-2 transition duration-200 ease-in-out'
              onClick={() => {

              }}
            >
              {spiels.BUTTON_VISIT_PROPERTY}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;

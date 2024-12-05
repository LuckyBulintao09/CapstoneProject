"use client";
import { createClient } from '@/utils/supabase/client';
import { checkConversation } from './checkConversation';
import { sendMessage } from './sendMessage';
import { sendSystemMessage } from './systemGeneratedMessage';
import { toast } from 'sonner';

const supabase = createClient();

export const initializeSendMessage = async (ownerId: string, ownerName: string, ownerLastname: string, inputValue?: string, propertyTitle?: string) => {
  const currentUser = await supabase.auth.getUser();
  const conversationUrl = await generateMessage(currentUser.data.user.id, ownerId, ownerName, ownerLastname, inputValue, propertyTitle);

  return conversationUrl;
};

const generateMessage = async (currentUserId, currentReceiverId, ownerName, ownerLastname, inputValue: string, propertyTitle) => {
  const messageTemplate = ` ${inputValue}`;

  const conversationId = await checkConversation(currentUserId, currentReceiverId, ownerName, ownerLastname);

  if (conversationId) {
    await sendSystemMessage({
      userId: currentUserId,
      receiverId: currentReceiverId,
      conversationId,
      messageContent: `On "${propertyTitle}"`,
      setMessages: () => {},
    });
    await sendMessage({
      userId: currentUserId,
      receiverId: currentReceiverId,
      conversationId,
      messageContent: messageTemplate,
      setMessages: () => {},
      
    });
    return '/chat/inbox'; 
  } else {
    console.error("Could not establish a conversation ID.");
    return null;
  }
};

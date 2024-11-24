"use server";
import { createClient } from '@/utils/supabase/server';
import { checkConversation } from './checkConversation';
import { sendMessage } from './sendMessage';
import { sendSystemMessage } from './systemGeneratedMessage';

const supabase = createClient();

export const initializeSendMessage = async (ownerId: string, propertyId: string, ownerName: string, ownerLastname: string, inputValue?: string) => {
  const currentUser = await supabase.auth.getUser();
  const conversationUrl = await generateMessage(currentUser.data.user.id, ownerId, propertyId, ownerName, ownerLastname, inputValue);

  return conversationUrl;
};

const generateMessage = async (currentUserId, currentReceiverId, propertyId, ownerName, ownerLastname, inputValue: string) => {
  const unitDetails = await supabase
    .from('unit')
    .select('*')
    .eq('id', propertyId)
    .single();

  const unitName = unitDetails.data.title;
  const unitPrice = unitDetails.data.price;
  const messageTemplate = ` ${inputValue}`;

  const conversationId = await checkConversation(currentUserId, currentReceiverId, ownerName, ownerLastname);

  if (conversationId) {
    await sendSystemMessage({
      userId: currentUserId,
      receiverId: currentReceiverId,
      conversationId,
      messageContent: `On ${unitName} at ${unitPrice} dollars.`,
      setMessages: () => {},
    })
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

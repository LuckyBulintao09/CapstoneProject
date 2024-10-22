"use server";
import { createClient } from '../../../supabase/server';
import { checkConversation } from './checkConversation';
import { sendMessage } from './sendMessage';
const supabase = createClient();

export const initializeSendMessage = async (ownerId: string, propertyId: string, ownerName: string, ownerLastname: string) => {
  console.log("ownerName", ownerName);
  const currentUser = await supabase.auth.getUser();
  
  const conversationId = await generateMessage(currentUser.data.user.id, ownerId, propertyId, ownerName);
  
};

const generateMessage = async (currentUserId, currentReceiverId, propertyId, ownerName,ownerLastname) => {
  const unitDetails = await supabase
    .from('unit')
    .select('*')
    .eq('id', propertyId)
    .single();

  const unitName = unitDetails.data.title;
  const unitPrice = unitDetails.data.price;
  const messageTemplate = `Hi ${ownerName}, I am interested in ${unitName} at ${unitPrice} dollars.`;
  console.log("messageTemplate", messageTemplate);
  
  const conversationId = await checkConversation(currentUserId, currentReceiverId,ownerName,ownerLastname);

  if (conversationId) {
    console.log("Conversation ID:", conversationId);

    await sendMessage({
      userId: currentUserId,
      receiverId: currentReceiverId,
      conversationId,
      messageContent: messageTemplate,
      setMessages: () => {},
    })
  } else {
    console.error("Could not establish a conversation ID.");
  }
};

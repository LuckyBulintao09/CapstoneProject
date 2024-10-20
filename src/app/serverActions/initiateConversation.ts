
"use server"
import { id } from 'date-fns/locale';
import { createClient } from '../../../supabase/server';
const supabase = createClient()
export const sendMessage = async (ownerId: string, propertyId: string) => {
  console.log("owner", ownerId);
  console.log("propertyId", propertyId);
  const currentUser = await supabase.auth.getUser();
  console.log("currentUser", currentUser.data.user.id);
 
  await checkConversation(currentUser.data.user.id, ownerId);


  

  // Uncomment and modify your insert logic as necessary
  // const { data, error } = await supabase
  //   .from('messages')
  //   .insert([
  //     {
  //       sender_id: senderId,
  //       property_id: propertyId, // If you want to store propertyId
  //       created_at: new Date(),
  //     },
  //   ]);

  // if (error) {
  //   console.error('Error sending message:', error);
  // }
  
};



// export default async function PrivatePage() {
//   const supabase = createClient()

//   const { data, error } = await supabase.auth.getUser()
//   if (error || !data?.user) {
//     redirect('/login')
//   }
//     console.log(data.user.email)
//   return <p>Hello {data.user.email}</p>
// }


const checkConversation = async (currentUserId, currentReceiverId) => {
  console.log("currentUserId", currentUserId);
  console.log("currentReceiverId", currentReceiverId);
  console.log("CHECKING IF CONVERSATION EXISTS")
  // if (!currentUserId || !currentReceiverId) return;

  // const conversationId = `${currentUserId}_${currentReceiverId}`;

  // const { data: existingConversation, error: conversationError } = await supabase
  //   .from('conversations')
  //   .select('id')
  //   .eq('id', conversationId);

  // if (existingConversation && existingConversation.length > 0) {
  //   setConversationId(conversationId);
  //   return;
  // }

  // const receiverName = await supabase
  //   .from('account')
  //   .select('firstname, lastname')
  //   .eq('id', currentReceiverId)
  //   .single();

  // const { error: createError } = await supabase
  //   .from('conversations')
  //   .insert([{
  //     id: conversationId,
  //     user1: currentUserId,
  //     user2: currentReceiverId,
  //     receiver_firstname: receiverName.data.firstname,
  //     receiver_lastname: receiverName.data.lastname,
  //     created_at: new Date(),
  //   }]);

  // if (createError) {
  //   console.error('Error creating conversation:', createError);
  // } else {
  //   setConversationId(conversationId);
  // }
};
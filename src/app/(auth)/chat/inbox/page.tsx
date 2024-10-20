"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../../supabase/client';
import Inbox from './messages/page';

const supabase = createClient();

const Page = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null); 
  const [loading, setLoading] = useState(true); 

  // Fetch current user ID on component mount
  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        setCurrentUserId(session.data.session.user.id);
      }
    };

    fetchCurrentUserId();
  }, []);


  useEffect(() => {
    const fetchConversations = async () => {
      if (currentUserId) {
        setLoading(true);
        
        const { data: conversationData, error: conversationError } = await supabase
          .from('conversations')
          .select('user2')
          .eq('user1', currentUserId);

        if (conversationError) {
          console.error('Error fetching conversations:', conversationError);
        } else {
   
          const user2Ids = conversationData.map(conversation => conversation.user2);

          const { data: accountsData, error: accountsError } = await supabase
            .from('account')
            .select('id, firstname, lastname')
            .in('id', user2Ids); 

          if (accountsError) {
            console.error('Error fetching account details:', accountsError);
          } else {
            const conversationsWithDetails = conversationData.map(conversation => {
              const account = accountsData.find(account => account.id === conversation.user2);
              return {
                user2: conversation.user2,
                firstname: account?.firstname || 'Unknown',
                lastname: account?.lastname || 'User',
              };
            });
            setConversations(conversationsWithDetails);
          }
        }

        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId]);

  const handleSelectConversation = (receiverId) => {
    setSelectedReceiverId(receiverId);
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-200 p-4 rounded-lg shadow-md w-1/4">
        <h2 className="text-lg font-bold mb-4">Conversations ({conversations.length})</h2>
        {loading ? (
          <div className="text-center text-gray-600">Loading conversations...</div>
        ) : (
          <ul>
            {conversations.map((conversation) => (
              <li key={conversation.user2} className="mb-2 flex items-center"> 
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full mr-3">
                  {getInitials(conversation.firstname, conversation.lastname)}
                </div>
                <button
                  className="w-full text-left p-2 bg-white rounded hover:bg-gray-300"
                  onClick={() => handleSelectConversation(conversation.user2)} 
                >
                  {`${conversation.firstname} ${conversation.lastname}`}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Inbox */}
      <div className="flex-grow p-4">
        <Inbox receiver_id={selectedReceiverId} />
      </div>
    </div>
  );
};

export default Page;


// ===================PWEDE DI GUMAMIT NG USE-EFFECT PERO MAS MATAGAL MAG LOAD YUNG CONVERSATIONS========
// "use client"; 

// import React, { useState } from 'react';
// import { createClient } from '../../../../../supabase/client';
// import Inbox from './messages/page';

// const supabase = createClient();

// const Page = () => {
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [conversations, setConversations] = useState([]);
//   const [selectedReceiverId, setSelectedReceiverId] = useState(null); 

//   // Async function to fetch current user ID and conversations
//   const fetchData = async () => {
//     const session = await supabase.auth.getSession();
//     if (session.data.session) {
//       const userId = session.data.session.user.id;
//       setCurrentUserId(userId);

//       // Fetch conversations
//       const { data, error } = await supabase
//         .from('conversations')
//         .select('user2, receiver_firstname, receiver_lastname') 
//         .eq('user1', userId);

//       if (error) {
//         console.error('Error fetching conversations:', error);
//       } else {
//         setConversations(data);
//       }
//     }
//   };

//   // Immediately invoke fetchData on component mount
//   fetchData();

//   const handleSelectConversation = (receiverId) => {
//     setSelectedReceiverId(receiverId); 
//   };

//   // Function to get initials from names
//   const getInitials = (firstname, lastname) => {
//     return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="bg-gray-200 p-4 rounded-lg shadow-md w-1/4">
//         <h2 className="text-lg font-bold mb-4">Conversations</h2>
//         <ul>
//           {conversations.map((conversation) => (
//             <li key={conversation.user2} className="mb-2 flex items-center">
//               <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full mr-3">
//                 {getInitials(conversation.receiver_firstname, conversation.receiver_lastname)}
//               </div>
//               <button
//                 className="w-full text-left p-2 bg-white rounded hover:bg-gray-300"
//                 onClick={() => handleSelectConversation(conversation.user2)} 
//       
//                 {`${conversation.receiver_firstname} ${conversation.receiver_lastname}`}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Inbox */}
//       <div className="flex-grow p-4">
//         <Inbox receiver_id={selectedReceiverId} />
//       </div>
//     </div>
//   );
// };

// export default Page;

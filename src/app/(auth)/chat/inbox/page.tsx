"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../../supabase/client';
import Inbox from './messages/page';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className='bg-transparent m-2'>
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className=" p-4 rounded-lg m-2 shadow-md w-1/4 ">
        <h2 className="text-lg font-bold mb-4">Conversations ({conversations.length})</h2>
        {loading ? (

          <div className="text-center text-gray-600">Loading conversations...</div>
        ) : (
         
          <ul>
            {conversations.map((conversation) => (
               <Card className='m-1 bg-transparent pl-3 '>
              <li key={conversation.user2} className="mb-2 flex items-center"> 
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-secondary rounded-full mr-2">
                  {getInitials(conversation.firstname, conversation.lastname)}
                </div>
                <button
                  className="w-full text-left p-2  rounded "
                  onClick={() => handleSelectConversation(conversation.user2)} 
                >
                  <strong>{`${conversation.firstname} ${conversation.lastname}`}</strong>
                  <br />
                  <small className='text-gray-500 text-xs'>Placeholder for text</small>
                </button>
              </li>
              </Card>
            ))}
          </ul>
        )}
      </div>

      {/* Inbox */}
      <div className="flex-grow p-4">
        <Inbox receiver_id={selectedReceiverId} />
      </div>
    </div>
    </Card>
  );
};

export default Page;



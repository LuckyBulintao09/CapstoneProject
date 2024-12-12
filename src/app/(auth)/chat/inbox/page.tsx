'use client';

import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { fetchConversations } from '@/actions/chat/fetchConversations';
import { createClient } from '@/utils/supabase/client';
import { BadgeCheck, ChevronsUpDown, X, MoreVertical, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { setAsRead } from '@/actions/chat/setAsRead';

const Inbox = lazy(() => import('./messages/page'));
const supabase = createClient();

const Page = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 
  const [showArchived, setShowArchived] = useState(false);
  const [showConversations, setShowConversations] = useState(false); 
  const [messagesOpen, setMessagesOpen] = useState(false); 
  const [isSmallScreen, setIsSmallScreen] = useState(false); 

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
    if (!currentUserId) return;

    const loadConversations = async () => {
      const fetchedConversations = await fetchConversations(currentUserId);
      setConversations((prev) => {
        const updatedConversations = new Map(prev.map((c) => [c.user2, c]));
        fetchedConversations.forEach((newConv) => {
          updatedConversations.set(newConv.user2, newConv); 
        });
        return Array.from(updatedConversations.values());
      });
    };

    loadConversations(); 

    const intervalId = setInterval(() => {
      loadConversations(); 
    }, 3000);

    return () => clearInterval(intervalId); 
  }, [currentUserId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSmallScreen(true);
        setShowConversations(true); 
      } else {
        setIsSmallScreen(false);
        setShowConversations(false); 
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectConversation = useCallback(
    (receiverId: string, companyName: string | null) => {
      setSelectedReceiverId(receiverId);
      setSelectedCompanyName(companyName);
      setMessagesOpen(true); 
      setShowConversations(false); 
    },
    []
  );

  const getInitials = useCallback((firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  }, []);

  const toggleArchiveConversation = async (user2: string, isArchived: boolean) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ isArchived: !isArchived })
        .eq('user1', currentUserId)
        .eq('user2', user2);

      if (error) {
        console.error('Error updating conversation:', error);
        toast.error('Failed to update conversation.');
        return;
      }

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.user2 === user2
            ? { ...conversation, isArchived: !isArchived }
            : conversation
        )
      );
      toast.success(
        isArchived ? 'Conversation unarchived.' : 'Conversation archived.'
      );
    } catch (err) {
      console.error('Error updating conversation:', err);
      toast.error('Failed to update conversation.');
    }
  };

  const filteredConversations = useMemo(() => {
    const sortedConversations = showArchived
      ? conversations.filter((conversation) => conversation.isArchived)
      : conversations.filter((conversation) => !conversation.isArchived);
  
    // console.log('Sorted Conversations before sorting:', sortedConversations.map(c => c.updated_at));
  
    return sortedConversations.sort((a, b) => {
      const currentDate = new Date().toISOString().split('T')[0]; 
 
      const dateA = new Date(`${currentDate}T${a.updated_at}`);
      const dateB = new Date(`${currentDate}T${b.updated_at}`);
  
      // console.log(`Comparing: ${dateA} vs ${dateB}`);
  
      // Sort in descending order: latest updated_at first
      return dateB.getTime() - dateA.getTime();
    });
  }, [conversations, showArchived]);
  
  
  
  
  

  const conversationList = useMemo(() => {
    return filteredConversations.map((conversation) => (
      <Card
        key={conversation.user2}
        className={`m-1 bg-transparent pl-2 ${conversation.read === false ? 'font-bold' : ''}`}
      >
        <li className='mb-2 flex items-center justify-between'>
          <div className='flex items-center w-full'>
            <div className='flex-shrink-0 w-10 h-10 flex items-center justify-center bg-secondary rounded-full mr-2'>
              {getInitials(conversation.firstname, conversation.lastname)}
            </div>
            <button
              className='w-full text-left p-2 rounded overflow-hidden'
              onClick={() =>
                handleSelectConversation(conversation.user2, conversation.company_name)
              }
            >
              <div className='flex items-center justify-between'>
                <div>
                  <strong className='text-sm block'>
                    {`${conversation.firstname} ${conversation.lastname}`}
                  </strong>
                  {conversation.company_name && (
                    <div className='flex items-center gap-1 text-xs text-blue-500'>
                      <small>{conversation.company_name}</small>
                      <BadgeCheck className='w-3 h-3 text-white bg-blue-500 rounded-full' />
                    </div>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='p-0'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    <DropdownMenuLabel className='text-xs'>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className='text-xs'
                      onClick={() => toggleArchiveConversation(conversation.user2, conversation.isArchived)}
                    >
                      {conversation.isArchived ? 'Unarchive Conversation' : 'Archive Conversation'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <small className='text-sm truncate block'>
                {conversation.last_message}
              </small>
              <small className='text-gray-500 text-xs truncate block'>
                {conversation.updated_at}
              </small>
            </button>
          </div>
        </li>
      </Card>
    ));
  }, [filteredConversations, getInitials, handleSelectConversation]);

  return (
    <Card className='bg-transparent m-2'>
      <div className='flex h-screen'>
        {/* Sidebar */}
        <div className={`p-4 rounded-lg m-2 shadow-md w-full md:w-1/3 lg:w-1/4 overflow-auto mt-[3.54rem] border-r border-gray-300 ${showConversations ? 'block fixed inset-0 z-10 bg-white' : 'hidden'} lg:block`}>
          <h2 className='text-lg font-bold mb-4'>
            {filteredConversations.length === 0
              ? 'Archived Conversations'
              : `Showing ${showArchived ? 'Archived' : 'Current'} Conversations (${filteredConversations.length})`}
          </h2>

          <div className='relative flex justify-between'>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={showConversations}
              className='w-full justify-between mb-4'
              onClick={() => setShowArchived(!showArchived)}
            >
              {showArchived ? 'Archived Conversations' : 'Current Conversations'}
              <ChevronsUpDown className='opacity-50' />
            </Button>
            {selectedReceiverId && (
              <div className='relative group'>
                <Button
                  className='ml-2'
                  onClick={() => {
                    setSelectedReceiverId(null); 
                    setSelectedCompanyName(null); 
                    setMessagesOpen(false); 
                  }}
                >
                  <X className='w-4 h-4' />
                </Button>

                <span className='absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 text-xs text-white-500 opacity-0 group-hover:opacity-100 transition-opacity'>
                  Close conversation
                </span>
              </div>
            )}
          </div>
          {loading ? (
            <div className='text-center text-gray-600'>Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div className='text-center text-gray-500 p-4'>
              No Conversations
            </div>
          ) : (
            <ul>{conversationList}</ul>
          )}
        </div>

        {/* Sidebar Toggle Button */}
        <Button
          variant='ghost'
          className='lg:hidden absolute top-4 left-4'
          onClick={() => {
            setShowConversations(!showConversations); 
            setMessagesOpen(false); 
          }}
        >
          <Menu className='w-6 h-6' />
        </Button>

        {/* Messages */}
        <div className={`flex-grow p-4 overflow-auto ${messagesOpen ? 'block' : 'hidden'} lg:block`}>
          <Button
            variant='outline'
            className='lg:hidden w-full bg-primary text-white mb-4'
            onClick={() => {
              setShowConversations(true); 
              setMessagesOpen(false); 
            }}
          >
            Show Conversations
          </Button>
          <Suspense fallback={<div>Loading chat...</div>}>
            {selectedReceiverId ? (
              <Inbox receiver_id={selectedReceiverId} company_name={selectedCompanyName} />
            ) : (
              <div className='text-center text-gray-500'>
                No conversation selected.
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </Card>
  );
};

export default Page;

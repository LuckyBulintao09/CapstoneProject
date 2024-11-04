"use client"
import { useEffect, useState, useRef } from 'react';
import { checkConversation } from '@/actions/chat/checkConversation'; 
import { sendMessage } from '@/actions/chat/sendMessage'; 
import { fetchReceiverName } from '@/actions/chat/fetchReceiverName'; 
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const supabase = createClient();

const Inbox = ({ receiver_id }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [user, setUser] = useState(null);
  const [conversationId, setConversationId] = useState(null); 
  const [receiverName, setReceiverName] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchMessages = async (currentUserId, currentReceiverId) => {
    if (!currentUserId || !currentReceiverId) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .or(`sender_id.eq.${currentReceiverId},receiver_id.eq.${currentReceiverId}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data;
  };

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        console.error('User not logged in.');
        window.location.href = '/';
        return;
      }
      setUser(session.data.session.user);
      if (receiver_id) {
        const convId = await checkConversation(session.data.session.user.id, receiver_id);
        setConversationId(convId); 
        const messagesData = await fetchMessages(session.data.session.user.id, receiver_id);
        setMessages(messagesData);
        const nameData = await fetchReceiverName(receiver_id); 
        setReceiverName(nameData);
      }
    };

    fetchUserAndMessages();

    const channel = supabase.channel('messages');

    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.sender_id === receiver_id || payload.new.receiver_id === receiver_id) {
          setMessages(prevMessages => [...prevMessages, payload.new]);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [receiver_id]);

  useEffect(() => {
    if (user && receiver_id) {
      fetchMessages(user.id, receiver_id);  
    }
  }, [user, receiver_id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    await sendMessage({
      userId: user.id,
      receiverId: receiver_id,
      conversationId,
      messageContent,
      setMessages,
    });
    setMessageContent(''); 
  };

  return (
    <Card className='w-full h-full bg-transparent'>
      <div className="w-full h-full flex flex-col p-4">
        {/* Receiver's Name and Avatar */}
        {receiver_id && receiverName && (
          <Card className="flex items-center p-2 shadow-sm mb-4 bg-transparent">
            <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full mr-3">
              {`${receiverName.firstname.charAt(0)}${receiverName.lastname.charAt(0)}`}
            </div>
            <div>
              <h1 className="text-md font-semibold">
                {receiverName.firstname} {receiverName.lastname}
              </h1>
              <p className="text-xs text-green-500">Active now</p>
            </div>
          </Card>
        )}

        {/* Messages Container */}
        <ScrollArea className="flex-1 p-4  rounded-lg mb-4 bg-transparent">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground">No conversation selected.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 max-w-xs p-2 rounded-lg text-sm break-words ${
                  msg.sender_id === user.id
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'mr-auto bg-gray-300 text-gray-800 '
                }`}
              >
                <p>{msg.content}</p>
                <small className="block text-xs mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </small>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Message Input */}
        <Card className="p-2 bg-transparent">
          <form onSubmit={sendMessageHandler} className="flex items-center">
            <Input
              type="text"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow mr-2"
              required
            />
            <Button type="submit">Send</Button>
          </form>
        </Card>
      </div>
    </Card>
  );
};

export default Inbox;

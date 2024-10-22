import { useEffect, useState, useRef } from 'react';
import { createClient } from '../../../../../../supabase/client';
import { checkConversation } from '@/actions/chat/checkConversation'; 
import { sendMessage } from '@/actions/chat/sendMessage'; 
import { fetchReceiverName } from '@/actions/chat/fetchReceiverName'; 

const supabase = createClient();


const Inbox = ({ receiver_id }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [user, setUser] = useState(null);
  const [conversationId, setConversationId] = useState(null); 
  const [receiverName, setReceiverName] = useState(null);
  const messagesEndRef = useRef(null);

  // Re-introduce fetchMessages inside the component
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

    // CONNECT TO CHANNEL
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
    <div className="w-full h-full flex flex-col p-4 bg-white">
      {/* Receiver's Name and Avatar */}
      <div className="mb-4 bg-gray-200 rounded">
        {receiver_id ? (
          receiverName && (
            <div className="flex items-center bg-gray-200 rounded p-2 shadow-sm rounded-md">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full mr-3">
                {`${receiverName.firstname.charAt(0)}${receiverName.lastname.charAt(0)}`}
              </div>
              <div>
                <h1 className="text-md font-semibold text-gray-900">
                  {receiverName.firstname} {receiverName.lastname}
                </h1>
                <p className="text-xs text-green-500">Active now</p>
              </div>
            </div>
          )
        ) : (
          <p className="text-center text-gray-500"></p>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto mb-4 p-2 bg-white rounded-lg shadow-inner">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 max-w-xs ${msg.sender_id === user.id ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-200 text-black'} p-2 rounded-lg text-sm break-words`}
            >
              <p>{msg.content}</p>
              <small className="block text-xs text-gray-400 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={sendMessageHandler}
        className="flex items-center bg-white p-2 rounded-full shadow-md"
      >
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow bg-gray-100 p-2 text-sm rounded-full outline-none focus:ring focus:ring-blue-300"
          required
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  );
};

export default Inbox;

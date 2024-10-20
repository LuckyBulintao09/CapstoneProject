"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '../../../../../supabase/client';

const supabase = createClient();

const Inbox = () => {
  const { id: receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        console.error('User not logged in.');
        return;
      }
      setUser(session.data.session.user);
      console.log('User fetched:', session.data.session.user);

      await fetchMessages(session.data.session.user.id, receiverId);
    };

    fetchUserAndMessages();


    const channel = supabase.channel('messages');

    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.sender_id === receiverId || payload.new.receiver_id === receiverId) {
          // Update messages state directly without fetching
          setMessages(prevMessages => [...prevMessages, payload.new]);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [receiverId]); // Only re-run when receiverId changes

  useEffect(() => {
    if (user) {
      fetchMessages(user.id, receiverId);
    }
  }, [user, receiverId]); // Fetch messages when user or receiverId changes

  const fetchMessages = async (currentUserId, currentReceiverId) => {
    if (!currentUserId || !currentReceiverId) return; // Ensure user and receiver are available
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .or(`sender_id.eq.${currentReceiverId},receiver_id.eq.${currentReceiverId}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      console.log('Fetched messages:', data);
      setMessages(data);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log('Sending message:', messageContent);
    const { data, error } = await supabase.from('messages').insert([
      {
        sender_id: user.id,
        receiver_id: receiverId,
        content: messageContent,
        created_at: new Date(),
      },
    ]);
  
    if (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    } else if (data && data.length > 0) { // Ensure data is available and has elements
      // Immediately add the new message to the state
      setMessages(prevMessages => [
        ...prevMessages,
        { ...data[0], sender_id: user.id } // Adding the new message to the local state
      ]);
      setMessageContent(''); // Clear the input field after sending
    } else {
      console.warn('No data returned after message insert.');
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>
      <div className="h-64 border border-gray-300 rounded overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`p-2 ${msg.sender_id === user.id ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
              <p>{msg.content}</p>
              <small className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type a message..."
          className="border border-gray-300 rounded p-2 flex-grow"
          required
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white rounded px-4 py-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default Inbox;

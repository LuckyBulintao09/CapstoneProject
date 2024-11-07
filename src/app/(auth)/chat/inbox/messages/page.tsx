import { useEffect, useState, useRef } from "react";
import { checkConversation } from "@/actions/chat/checkConversation";
import { sendMessage } from "@/actions/chat/sendMessage";
import { fetchReceiverName } from "@/actions/chat/fetchReceiverName";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import { BadgeCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";
import sendImage from "@/actions/chat/sendImage";

const supabase = createClient();

const Inbox = ({ receiver_id }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [user, setUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [receiverName, setReceiverName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async (currentUserId, currentReceiverId) => {
    if (!currentUserId || !currentReceiverId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .or(
        `sender_id.eq.${currentReceiverId},receiver_id.eq.${currentReceiverId}`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
    return data;
  };

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        console.error("User not logged in.");
        window.location.href = "/";
        return;
      }
      setUser(session.data.session.user);
      if (receiver_id) {
        const convId = await checkConversation(
          session.data.session.user.id,
          receiver_id
        );
        setConversationId(convId);
        const messagesData = await fetchMessages(
          session.data.session.user.id,
          receiver_id
        );
        setMessages(messagesData);
        const nameData = await fetchReceiverName(receiver_id);
        setReceiverName(nameData);
      }
    };

    fetchUserAndMessages();

    const channel = supabase.channel("messages");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (
            payload.new.sender_id === receiver_id ||
            payload.new.receiver_id === receiver_id
          ) {
            setMessages((prevMessages) => [...prevMessages, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [receiver_id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
    setMessageContent("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      toast.error("Please choose a file to upload");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please upload a valid image file (JPEG, PNG, GIF, or WEBP)."
      );
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
  };

  const submitImageHandler = async (e) => {
    e.preventDefault();
    if (selectedFile && user) {
      setLoading(true);
      try {
        await sendImage(user.id, receiver_id, conversationId, selectedFile);
        toast.success("Image sent successfully!");
        setModalOpen(false);
      } catch (error) {
        toast.error("Error sending image.");
      } finally {
        setLoading(false);
        setSelectedFile(null);
      }
    }
  };

  return (
    <Card className="w-full h-full bg-transparent">
      <div className="w-full h-full flex flex-col p-4">
        {receiver_id && receiverName && (
          <Card className="flex items-center p-2 shadow-sm mb-4 bg-transparent">
            <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full mr-3">
              {`${receiverName.firstname.charAt(
                0
              )}${receiverName.lastname.charAt(0)}`}
            </div>
            <div>
              <h1 className="text-md font-semibold">
                {receiverName.firstname} {receiverName.lastname}
              </h1>
              <div className="flex items-center gap-1">
                {receiverName.company_name && (
                  <BadgeCheck className="w-5 h-5 text-white bg-blue-500 rounded-full" />
                )}
                <p className="text-xs text-blue-500">
                  {receiverName.company_name}
                </p>
              </div>
            </div>
          </Card>
        )}

        <ScrollArea className="flex-1 p-4 rounded-lg mb-4 bg-transparent">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No conversation selected.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 max-w-xs p-2 rounded-lg text-sm break-words ${
                  msg.sender_id === user.id
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "mr-auto bg-gray-300 text-gray-800"
                }`}
              >
                {msg.content.startsWith("http") ? (
                  <img
                    src={msg.content}
                    alt="sent image"
                    className="rounded-md"
                  />
                ) : (
                  <p>{msg.content}</p>
                )}
                <small className="block text-xs mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </small>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <form onSubmit={sendMessageHandler} className="flex items-center">
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-transparent hover:bg-transparent">
                <PlusCircleIcon className="text-primary hover:text-secondary-foreground" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-white">Send an image</DialogTitle>
                <DialogDescription className="text-white">
                  Attach your image here
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center">
                  <Input
                    id="file-input"
                    type="file"
                    className="col-span-3 rounded-full bg-secondary text-white"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={submitImageHandler}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow mr-2 rounded-full"
            required
          />
          <Button type="submit" className="bg-transparent hover:bg-secondary">
            <PaperAirplaneIcon className="w-8 h-8 text-primary" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default Inbox;

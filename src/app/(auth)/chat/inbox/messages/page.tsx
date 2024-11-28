"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { checkConversation } from "@/actions/chat/checkConversation";
import { sendMessage } from "@/actions/chat/sendMessage";
import { fetchReceiverName } from "@/actions/chat/fetchReceiverName";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import { BadgeCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";
import sendImage from "@/actions/chat/sendImage";
import imageCompression from "browser-image-compression";

const supabase = createClient();

const Inbox = ({ receiver_id, company_name }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [user, setUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [receiverName, setReceiverName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [imageLoading, setImageLoading] = useState({}); 
  const messagesEndRef = useRef(null);

  const receiverNameMemo = useMemo(() => receiverName, [receiverName]);

  const fetchMessages = useCallback(async (currentUserId, currentReceiverId) => {
    if (!currentUserId || !currentReceiverId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .or(`sender_id.eq.${currentReceiverId},receiver_id.eq.${currentReceiverId}`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
    return data;
  }, []);

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
        const convId = await checkConversation(session.data.session.user.id, receiver_id);
        setConversationId(convId);

        const messagesData = await fetchMessages(session.data.session.user.id, receiver_id);
        setMessages(messagesData);

        const nameData = await fetchReceiverName(receiver_id);
        setReceiverName(nameData);
      }
    };

    fetchUserAndMessages();

    const channel = supabase.channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        if (payload.new.sender_id === receiver_id || payload.new.receiver_id === receiver_id) {
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      })
      .subscribe();

    return () => channel.unsubscribe();
  }, [receiver_id, fetchMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessageHandler = useCallback(async (e) => {
    e.preventDefault();
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      sender_id: user.id,
      receiver_id,
      status: "sending",
    };

    setPendingMessages((prev) => [...prev, tempMessage]);
    setMessageContent("");

    try {
      await sendMessage({
        userId: user.id,
        receiverId: receiver_id,
        conversationId,
        messageContent,
        setMessages,
      });

      setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    } catch (error) {
      toast.error("Failed to send the message.");
      setPendingMessages((prev) =>
        prev.map((msg) => (msg.id === tempMessage.id ? { ...msg, status: "error" } : msg))
      );
    }
  }, [user, receiver_id, conversationId, messageContent]);

  const handleFileChange = async (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      toast.error("Please choose a file to upload");
      return;
    }
  
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WEBP).");
      event.target.value = "";
      return;
    }
  
    const maxSize = 2.5 * 1024 * 1024;
  
    try {
      let fileToUpload = file;
  
      // Compress the file if it's 2.5MB or larger
      if (file.size >= maxSize) {
        const options = {
          maxSizeMB: 1.5, 
          maxWidthOrHeight: 800, 
          useWebWorker: true,
        };
        toast.info("Image upload is too large. Compressing...");
        fileToUpload = await imageCompression(file, options);
      }
      setSelectedFile(fileToUpload);
    } catch (error) {
      toast.error("Error compressing image");
    }
  };

  const submitImageHandler = useCallback(async (e) => {
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
  }, [selectedFile, user, receiver_id, conversationId]);

  const handleImageLoad = (id) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id) => {
    toast.error("Failed to load image.");
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <Card className="w-full h-full bg-transparent">
      <div className="w-full h-full flex flex-col p-4">
        {receiver_id && receiverNameMemo && (
          <Card className="flex items-center p-2 shadow-sm mb-4 bg-transparent">
            <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full mr-3">
              {receiverNameMemo.firstname.charAt(0)}{receiverNameMemo.lastname.charAt(0)}
            </div>
            <div>
              <h1 className="text-md font-semibold">
                {receiverNameMemo.firstname} {receiverNameMemo.lastname}
              </h1>
              {company_name && (
                <div className="flex items-center gap-1">
                  <BadgeCheck className="w-5 h-5 text-white bg-blue-500 rounded-full" />
                  <p className="text-xs text-blue-500">{company_name}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        <ScrollArea className="flex-1 p-4 rounded-lg mb-4 bg-transparent">
          {messages.map((msg) => {
            const isSystemGenerated = msg.system_generated === true;
            const messageClasses = isSystemGenerated
              ? "mx-auto italic text-center p-3 rounded-md shadow-md border border-dashed border-gray-400"
              : msg.sender_id === user.id
              ? "ml-auto bg-primary text-primary-foreground"
              : "mr-auto bg-gray-300 text-gray-800";

            return (
              <div key={msg.id} className={`mb-2 max-w-xs p-2 rounded-lg text-sm break-words ${messageClasses}`}>
                {msg.content.startsWith("http") ? (
                  <>
                   {imageLoading[msg.id] !== false && <p>Loading image...</p>}
                    <img
                      src={msg.content}
                      alt="sent image"
                      className="rounded-md cursor-pointer"
                      onLoad={() => handleImageLoad(msg.id)}
                      onError={() => handleImageError(msg.id)}
                      onClick={() => setExpandedImage(msg.content)}
                      style={{ display: imageLoading[msg.id] !== false ? "none" : "block" }}
                    />
                  </>
                ) : (
                  <p>{msg.content}</p>
                )}
                <small className="block text-xs mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </small>
              </div>
            );
          })}
          {pendingMessages.map((msg) => (
            <div
              key={msg.id}
              className="mb-2 max-w-xs p-2 rounded-lg text-sm break-words ml-auto bg-transparent border text-gray-600"
            >
              <p>
                {msg.status === "sending" ? "Sending..." : "Failed to send"}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {expandedImage && (
          <Dialog open={!!expandedImage} onOpenChange={() => setExpandedImage(null)}>
            <DialogContent>
              <img src={expandedImage} alt="expanded" className="w-full h-auto rounded-md mt-2" />
            </DialogContent>
          </Dialog>
        )}

        <form onSubmit={sendMessageHandler} className="flex items-center">
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-transparent hover:bg-transparent">
                <PlusCircleIcon className="text-primary hover:text-secondary-foreground" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Send an image</DialogTitle>
              </DialogHeader>
              <DialogDescription>Images over 2.5MB will automatically be compressed.</DialogDescription>
              <div className="grid gap-4 py-4">
                <div className="grid items-center">
                  <Input id="file-input" type="file" className="col-span-3 rounded-full bg-secondary" onChange={handleFileChange} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={submitImageHandler} disabled={loading}>
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
          <Button type="submit" className="bg-transparent hover:bg-transparent">
            <PaperAirplaneIcon className="w-5 h-5 text-blue-500 hover:text-secondary-foreground" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default Inbox;

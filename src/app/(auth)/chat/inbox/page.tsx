"use client";

import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { fetchConversations } from "@/actions/chat/fetchConversations";
import { createClient } from "@/utils/supabase/client";
import { BadgeCheck, MoreVertical } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { X } from "lucide-react";
const Inbox = lazy(() => import("./messages/page"));
const supabase = createClient();

const Page = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [open, setOpen] = useState(false);

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
      setLoading(true);
      const fetchedConversations = await fetchConversations(currentUserId);
      setConversations(fetchedConversations);
      setLoading(false);
    };

    loadConversations();
  }, [currentUserId]);

  const handleSelectConversation = useCallback((receiverId: string, companyName: string | null) => {
    setSelectedReceiverId(receiverId);
    setSelectedCompanyName(companyName);
  }, []);

  const getInitials = useCallback((firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  }, []);

  const toggleArchiveConversation = async (user2: string, isArchived: boolean) => {
    try {
      const { error } = await supabase
        .from("conversations")
        .update({ isArchived: !isArchived })
        .eq("user1", currentUserId)
        .eq("user2", user2);

      if (error) {
        console.error("Error updating conversation:", error);
        toast.error("Failed to update conversation.");
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
        isArchived ? "Conversation unarchived." : "Conversation archived."
      );
    } catch (err) {
      console.error("Error updating conversation:", err);
      toast.error("Failed to update conversation.");
    }
  };

  const filteredConversations = useMemo(() => {
    return showArchived
      ? conversations.filter((conversation) => conversation.isArchived)
      : conversations.filter((conversation) => !conversation.isArchived);
  }, [conversations, showArchived]);

  const conversationList = useMemo(() => {
    return filteredConversations.map((conversation) => (
      <Card key={conversation.user2} className="m-1 bg-transparent pl-2">
        <li className="mb-2 flex items-center justify-between">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-secondary rounded-full mr-2">
              {getInitials(conversation.firstname, conversation.lastname)}
            </div>
            <button
              className="w-full text-left p-2 rounded overflow-hidden"
              onClick={() =>
                handleSelectConversation(conversation.user2, conversation.company_name)
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-sm block">
                    {`${conversation.firstname} ${conversation.lastname}`}
                  </strong>
                  {conversation.company_name && (
                    <div className="flex items-center gap-1 text-xs text-blue-500">
                      <small>{conversation.company_name}</small>
                      <BadgeCheck className="w-3 h-3 text-white bg-blue-500 rounded-full" />
                    </div>
                  )}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <MoreVertical className=" w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toggleArchiveConversation(conversation.user2, conversation.isArchived)
                      }
                    >
                      {conversation.isArchived ? "Unarchive Conversation" : "Archive Conversation"}
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
              <small className="text-sm truncate block">
                {conversation.last_message}
              </small>
              <small className="text-gray-500 text-xs truncate block">
                {conversation.updated_at}
              </small>
            </button>
          </div>
        </li>
      </Card>
    ));
  }, [filteredConversations, getInitials, handleSelectConversation]);

  return (
    <Card className="bg-transparent m-2">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="p-4 rounded-lg m-2 shadow-md w-1/4 overflow-auto border-r border-gray-300">
          <h2 className="text-lg font-bold mb-4">
            {filteredConversations.length === 0 ? (
              'Archived Conversations'
            ) : (
              `Showing ${showArchived ? 'Archived' : 'Current'} Conversations (${filteredConversations.length})`
            )}
          </h2>

          {/* Combobox for  Archived Conversations */}
          <div className="relative flex justify-between ">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between mb-4"
              >
                {showArchived ? "Archived Conversations" : "Current Conversations"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="absolute right-0 top-full mt-2 w-auto min-w-[200px] max-w-full rounded-md shadow-md p-0"
            >
              <Command>
                <CommandList>
                  <CommandItem
                    onSelect={() => {
                      setShowArchived(!showArchived);
                      setOpen(false);
                    }}
                  >
                    {showArchived ? "Current" : "Archived"} Conversations
                  </CommandItem>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="relative group">
            <Button
              className="ml-2"
              onClick={() => {
                setSelectedReceiverId(null);
                setSelectedCompanyName(null);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <span className=" absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 text-xs text-white-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Close conversation
            </span>
          </div>
        </div>
          {loading ? (
            <div className="text-center text-gray-600">Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              No Conversations
            </div>
          ) : (
            <ul>{conversationList}</ul>
          )}
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-auto">
          <Suspense fallback={<div>Loading chat...</div>}>
            {selectedReceiverId ? (
              <Inbox receiver_id={selectedReceiverId} company_name={selectedCompanyName} />
            ) : (
              <div className="text-center text-gray-500">
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

"use client";

import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { fetchConversations } from "@/actions/chat/fetchConversations";
import { createClient } from "@/utils/supabase/client";
import { BadgeCheck } from "lucide-react";

const Inbox = lazy(() => import("./messages/page"));
const supabase = createClient();

const Page = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const conversationList = useMemo(() => {
    return conversations.map((conversation) => (
      <Card key={conversation.user2} className="m-1 bg-transparent pl-2">
        <li className="mb-2 flex items-center">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-secondary rounded-full mr-2">
            {getInitials(conversation.firstname, conversation.lastname)}
          </div>
          <button
            className="w-full text-left p-2 rounded overflow-hidden"
            onClick={() =>
              handleSelectConversation(conversation.user2, conversation.company_name)
            }
          >
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
            <small className="text-sm truncate block">
              {conversation.last_message}
            </small>
            <small className="text-gray-500 text-xs truncate block">
              {conversation.updated_at}
            </small>
          </button>
        </li>
      </Card>
    ));
  }, [conversations, getInitials, handleSelectConversation]);

  return (
    <Card className="bg-transparent m-2">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="p-4 rounded-lg m-2 shadow-md w-1/4 overflow-auto border-r border-gray-300">
          <h2 className="text-lg font-bold mb-4">Conversations ({conversations.length})</h2>
          {loading ? (
            <div className="text-center text-gray-600">Loading conversations...</div>
          ) : (
            <ul>{conversationList}</ul>
          )}
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-auto ">
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

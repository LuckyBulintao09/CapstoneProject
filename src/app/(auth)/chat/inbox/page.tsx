"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "../../../../../supabase/client";
import Inbox from "./messages/page";
import { Card } from "@/components/ui/card";

const supabase = createClient();

const Page = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const fetchCurrentUserId = async () => {
      const session = await supabase.auth.getSession();
      if (session.data.session && !isCancelled) {
        setCurrentUserId(session.data.session.user.id);
      }
    };

    fetchCurrentUserId();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    let isCancelled = false;

    const fetchConversations = async () => {
      setLoading(true);

      try {
        const [conversationResponse, accountsResponse] = await Promise.all([
          supabase
            .from("conversations")
            .select("user2, last_message, updated_at") 
            .eq("user1", currentUserId)
            .order("updated_at", { ascending: false }), 
          supabase.from("account").select("id, firstname, lastname"),
        ]);

        if (!isCancelled) {
          const conversationData = conversationResponse.data || [];
          const accountsData = accountsResponse.data || [];

          const conversationsWithDetails = conversationData.map((conversation) => {
            const account = accountsData.find((account) => account.id === conversation.user2);
            return {
              user2: conversation.user2,
              firstname: account?.firstname || "Unknown",
              lastname: account?.lastname || "User",
              last_message: conversation.last_message || "No messages yet",
              updated_at: conversation.updated_at, 
            };
          });

          setConversations(conversationsWithDetails);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchConversations();

    return () => {
      isCancelled = true;
    };
  }, [currentUserId]);

  const handleSelectConversation = useCallback((receiverId) => {
    setSelectedReceiverId(receiverId);
  }, []);

  const getInitials = useCallback((firstname, lastname) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  }, []);

  return (
    <Card className="bg-transparent m-2">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="p-4 rounded-lg m-2 shadow-md w-1/4 overflow-auto">
          <h2 className="text-lg font-bold mb-4">Conversations ({conversations.length})</h2>
          {loading ? (
            <div className="text-center text-gray-600">Loading conversations...</div>
          ) : (
            <ul>
              {conversations.map((conversation) => (
                <Card key={conversation.user2} className="m-1 bg-transparent pl-3">
                  <li className="mb-2 flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-secondary rounded-full mr-2">
                      {getInitials(conversation.firstname, conversation.lastname)}
                    </div>
                    <button
                      className="w-full text-left p-2 rounded overflow-hidden whitespace-nowrap text-ellipsis"
                      onClick={() => handleSelectConversation(conversation.user2)}
                    >
                      <strong>{`${conversation.firstname} ${conversation.lastname}`}</strong>
                      <br />
                      <small className=" text-sm truncate block">
                        {conversation.last_message}
                      </small>
                      <small className="text-gray-500 text-xs truncate block">
                        {conversation.updated_at}
                      </small>
                    </button>
                  </li>
                </Card>
              ))}
            </ul>
          )}
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-auto">
          <Inbox receiver_id={selectedReceiverId} />
        </div>
      </div>
    </Card>
  );
};

export default Page;

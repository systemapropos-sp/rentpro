import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  getConversations,
  getMessages,
  sendMessage,
  subscribeToMessages,
} from '@/services/messageApi';
import { Loader } from '@/components/common/Loader';
import { Avatar } from '@/components/common/Avatar';
import type { Conversation, Message } from '@/types';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationId = searchParams.get('conversation');

  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id]);

  useEffect(() => {
    if (conversationId) {
      const conv = conversations.find((c) => c.id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
        loadMessages(conversationId);
      }
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    if (selectedConversation?.id) {
      const subscription = subscribeToMessages(selectedConversation.id, (newMsg) => {
        setMessages((prev) => {
          if (prev.find((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await getConversations(user!.id);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const data = await getMessages(convId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      await sendMessage(selectedConversation.id, user.id, newMessage.trim());
      setNewMessage('');
      loadMessages(selectedConversation.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getOtherParticipant = (conv: Conversation) => {
    return conv.guest_id === user?.id ? conv.host : conv.guest;
  };

  if (loading) {
    return (
      <div className="pt-24 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No tienes conversaciones</h2>
          <p className="text-gray-500">
            Cuando contactes a un anfitrión, tus mensajes aparecerán aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20 h-[calc(100vh-64px)] flex">
      {/* Conversations List */}
      <div
        className={`w-full lg:w-80 border-r bg-white overflow-y-auto ${
          selectedConversation ? 'hidden lg:block' : 'block'
        }`}
      >
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Mensajes</h1>
        </div>
        <div className="divide-y">
          {conversations.map((conv) => {
            const otherPerson = getOtherParticipant(conv);
            return (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv);
                  loadMessages(conv.id);
                }}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-gray-50' : ''
                }`}
              >
                <Avatar src={otherPerson?.avatar_url} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{otherPerson?.full_name || 'Usuario'}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {conv.property?.title || 'Propiedad'}
                  </p>
                  {conv.last_message && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {conv.last_message.content}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-white w-full">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <button
              onClick={() => setSelectedConversation(null)}
              className="lg:hidden text-sm text-gray-500"
            >
              ← Volver
            </button>
            <Avatar src={getOtherParticipant(selectedConversation)?.avatar_url} size="sm" />
            <div>
              <p className="font-medium">
                {getOtherParticipant(selectedConversation)?.full_name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500">{selectedConversation.property?.title}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isOwn = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      isOwn
                        ? 'bg-rose-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? 'text-white/70' : 'text-gray-400'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2.5 border rounded-full focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Selecciona una conversación para empezar a chatear</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;

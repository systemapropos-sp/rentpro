import { supabase } from './supabaseClient';
import { demoMessageApi } from './demoApi';
import type { Conversation, Message } from '@/types';

const USE_DEMO = true;

function isSupabaseReady() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && url.length > 0 && !url.includes('your-project');
}

export async function getConversations(_userId: string): Promise<Conversation[]> {
  if (USE_DEMO || !isSupabaseReady()) return demoMessageApi.getConversations();
  const { data, error } = await supabase.from('conversations').select(`*, property:properties(*), guest:profiles!guest_id(*), host:profiles!host_id(*), last_message:messages(*)`).or(`guest_id.eq.${_userId},host_id.eq.${_userId}`).order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Conversation[];
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const { data, error } = await supabase.from('conversations').select(`*, property:properties(*), guest:profiles!guest_id(*), host:profiles!host_id(*)`).eq('id', id).single();
  if (error) throw error;
  return data as unknown as Conversation | null;
}

export async function getOrCreateConversation(propertyId: string, guestId: string, hostId: string): Promise<Conversation> {
  if (USE_DEMO || !isSupabaseReady()) {
    return {
      id: 'conv-1',
      property_id: propertyId,
      guest_id: guestId,
      host_id: hostId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as unknown as Conversation;
  }
  // @ts-expect-error - Supabase typing
  const { data, error } = await supabase.from('conversations').insert({ property_id: propertyId, guest_id: guestId, host_id: hostId }).select(`*, property:properties(*), guest:profiles!guest_id(*), host:profiles!host_id(*)`).single();
  if (error) throw error;
  return data as unknown as Conversation;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  if (USE_DEMO || !isSupabaseReady()) return demoMessageApi.getMessages();
  const { data, error } = await supabase.from('messages').select(`*, sender:profiles(*)`).eq('conversation_id', conversationId).order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []) as unknown as Message[];
}

export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
  if (USE_DEMO || !isSupabaseReady()) return demoMessageApi.sendMessage(conversationId, senderId, content);
  // @ts-expect-error - Supabase typing
  const { data, error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: senderId, content }).select(`*, sender:profiles(*)`).single();
  if (error) throw error;
  return data as unknown as Message;
}

export function subscribeToMessages(_conversationId: string, _callback: (message: Message) => void) {
  return { unsubscribe: () => {} };
}

export function subscribeToConversations(_userId: string, _callback: (conversation: Conversation) => void) {
  return { unsubscribe: () => {} };
}

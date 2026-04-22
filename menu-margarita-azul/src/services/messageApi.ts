import { supabase } from './supabaseClient';
import type { Conversation, Message } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asAny(value: unknown): any {
  return value as any;
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      property:properties(*),
      guest:profiles!guest_id(*),
      host:profiles!host_id(*),
      last_message:messages(*)
    `)
    .or(`guest_id.eq.${userId},host_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as Conversation[];
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      property:properties(*),
      guest:profiles!guest_id(*),
      host:profiles!host_id(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as unknown as Conversation | null;
}

export async function getOrCreateConversation(
  propertyId: string,
  guestId: string,
  hostId: string
): Promise<Conversation> {
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('property_id', propertyId)
    .eq('guest_id', guestId)
    .eq('host_id', hostId)
    .single();

  if (existing && (existing as unknown as { id: string }).id) {
    const conv = await getConversationById((existing as unknown as { id: string }).id);
    if (conv) return conv;
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert(asAny({ property_id: propertyId, guest_id: guestId, host_id: hostId }))
    .select(`
      *,
      property:properties(*),
      guest:profiles!guest_id(*),
      host:profiles!host_id(*)
    `)
    .single();

  if (error) throw error;
  return data as unknown as Conversation;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles(*)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as Message[];
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert(asAny({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    }))
    .select(`
      *,
      sender:profiles(*)
    `)
    .single();

  if (error) throw error;
  return data as unknown as Message;
}

export function subscribeToMessages(
  conversationId: string,
  callback: (message: Message) => void
) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new as unknown as Message);
      }
    )
    .subscribe();
}

export function subscribeToConversations(
  userId: string,
  callback: (conversation: Conversation) => void
) {
  return supabase
    .channel(`conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `or(guest_id.eq.${userId},host_id.eq.${userId})`,
      },
      (payload) => {
        callback(payload.new as unknown as Conversation);
      }
    )
    .subscribe();
}

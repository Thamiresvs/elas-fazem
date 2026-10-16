import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from 'src/environments/environments';
import { ChatMessage } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private supabase: SupabaseClient;
  private channel: RealtimeChannel | null = null;
  messages = signal<ChatMessage[]>([]);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  async loadMessages(chatId: string, currentUserId?: string) {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      const mapped: ChatMessage[] = data.map((msg: any) => ({
        sender_name: msg.sender_id === currentUserId ? 'Você' : 'Prestadora',
        is_me: msg.sender_id === currentUserId,
        content: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      this.messages.set(mapped);
    } else {
      this.messages.set([]);
    }

    this.subscribeToChat(chatId, currentUserId);
  }

  subscribeToChat(chatId: string, currentUserId?: string) {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
    }

    this.channel = this.supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          const newMsg = payload.new as any;
          const formatted: ChatMessage = {
            sender_name: newMsg.sender_id === currentUserId ? 'Você' : 'Prestadora',
            is_me: newMsg.sender_id === currentUserId,
            content: newMsg.content,
            time: new Date(newMsg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          this.messages.update((prev) => [...prev, formatted]);
        }
      )
      .subscribe();
  }

  async sendMessage(chatId: string, senderId: string, content: string) {
    const { error } = await this.supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: senderId,
      content: content
    });

    if (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }
}

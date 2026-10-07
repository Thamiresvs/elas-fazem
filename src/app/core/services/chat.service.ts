import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ChatMessage } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private supabase = inject(SupabaseService).client;
  messages = signal<ChatMessage[]>([]);

  subscribeToChat(chatId: string) {
    this.supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          this.messages.update((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();
  }

  async sendMessage(chatId: string, senderId: string, content: string) {
    await this.supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: senderId,
      content
    });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  chatService = inject(ChatService);

  newMessage = '';
  chatId = '00000000-0000-0000-0000-000000000000';
  showAuthToast = signal(false);

  ngOnInit() {
    const providerId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.authService.currentUser();

    this.chatService.loadMessages(this.chatId, currentUser?.id);
  }

  async send() {
    if (!this.newMessage.trim()) return;

    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      this.showAuthToast.set(true);
      setTimeout(() => this.showAuthToast.set(false), 4000);
      return;
    }

    const content = this.newMessage;
    this.newMessage = '';

    try {
      // Garante que o registo na tabela chats existe
      const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
      await supabase.from('chats').upsert({
        id: this.chatId,
        client_id: currentUser.id,
        provider_id: '11111111-1111-1111-1111-111111111111'
      });

      await this.chatService.sendMessage(this.chatId, currentUser.id, content);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  }
}

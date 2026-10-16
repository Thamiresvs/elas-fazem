import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';

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

  // Sinal para controlar a exibição do Toast de aviso
  showAuthToast = signal(false);

  ngOnInit() {
    const providerId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.authService.currentUser();

    this.chatService.loadMessages(this.chatId, currentUser?.id);
  }

  async send() {
    if (!this.newMessage.trim()) return;

    const currentUser = this.authService.currentUser();

    // Se não estiver logada, exibe o Toast por 4 segundos
    if (!currentUser) {
      this.showAuthToast.set(true);
      setTimeout(() => this.showAuthToast.set(false), 4000);
      return;
    }

    const content = this.newMessage;
    this.newMessage = '';

    await this.chatService.sendMessage(this.chatId, currentUser.id, content);
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatMessage } from '../../core/models/app.models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  route = inject(ActivatedRoute);

  newMessage = '';
  messages = signal<ChatMessage[]>([
    { sender_name: 'Prestadora', is_me: false, content: 'Olá! Como posso ajudar com seu serviço?', time: '14:30' }
  ]);

  ngOnInit() {
    const providerId = this.route.snapshot.paramMap.get('id');
    console.log('Chat iniciado com prestadora:', providerId);
  }

  send() {
    if (!this.newMessage.trim()) return;

    this.messages.update(prev => [
      ...prev,
      {
        sender_name: 'Você',
        is_me: true,
        content: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    this.newMessage = '';
  }
}

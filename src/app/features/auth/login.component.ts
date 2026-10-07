import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  authService = inject(AuthService);

  isRegister = signal(false);
  email = '';
  password = '';
  fullName = '';
  errorMessage = signal('');

  async handleSubmit() {
    this.errorMessage.set('');
    try {
      if (this.isRegister()) {
        await this.authService.signUp(this.email, this.password, this.fullName);
        alert('Conta criada com sucesso!');
        this.isRegister.set(false);
      } else {
        await this.authService.signIn(this.email, this.password);
      }
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Erro na autenticação.');
    }
  }
}

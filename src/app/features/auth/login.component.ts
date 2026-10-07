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
  confirmPassword = '';
  fullName = '';


  showPassword = signal(false);
  showConfirmPassword = signal(false);

  errorMessage = signal('');

  toggleShowPassword() {
    this.showPassword.update(v => !v);
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword.update(v => !v);
  }

  async handleSubmit() {
    this.errorMessage.set('');

    if (this.isRegister()) {
      if (this.password !== this.confirmPassword) {
        this.errorMessage.set('As senhas não coincidem. Verifique e tente novamente.');
        return;
      }

      if (this.password.length < 6) {
        this.errorMessage.set('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
    }

    try {
      if (this.isRegister()) {
        await this.authService.signUp(this.email, this.password, this.fullName);
        alert('Conta criada com sucesso!');
        this.isRegister.set(false);
        this.password = '';
        this.confirmPassword = '';
      } else {
        await this.authService.signIn(this.email, this.password);
      }
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Erro na autenticação.');
    }
  }
}

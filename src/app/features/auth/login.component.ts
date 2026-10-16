import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export interface ToastConfig {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  isRegister = signal(false);
  email = '';
  password = '';
  confirmPassword = '';
  fullName = '';
  isProvider = false;

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  toast = signal<ToastConfig>({ show: false, message: '', type: 'info' });

  toggleShowPassword() {
    this.showPassword.update(v => !v);
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword.update(v => !v);
  }

  triggerToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toast.set({ show: true, message, type });
    setTimeout(() => {
      this.toast.set({ show: false, message: '', type: 'info' });
    }, 4500);
  }

  async handleSubmit() {
    if (this.isRegister()) {
      if (this.password !== this.confirmPassword) {
        this.triggerToast('As senhas não coincidem. Verifique e tente novamente.', 'error');
        return;
      }

      if (this.password.length < 6) {
        this.triggerToast('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
      }
    }

    try {
      if (this.isRegister()) {
        const res = await this.authService.signUp(this.email, this.password, this.fullName, this.isProvider);

        // Verifica se exige confirmação de e-mail pelo Supabase
        if (res.user && !res.session) {
          this.triggerToast('Conta criada! Verifique o seu e-mail para confirmar o cadastro.', 'info');
        } else {
          this.triggerToast('Conta criada com sucesso!', 'success');
        }

        this.isRegister.set(false);
        this.password = '';
        this.confirmPassword = '';
      } else {
        await this.authService.signIn(this.email, this.password);
        this.triggerToast('Login realizado com sucesso!', 'success');
        this.router.navigate(['/providers']);
      }
    } catch (err: any) {
      this.triggerToast(err.message || 'Erro ao realizar a autenticação.', 'error');
    }
  }
}

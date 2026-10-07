import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: './profile.component.html'
})
export class ProfileComponent {
  authService = inject(AuthService);

  userEmail() {
    return this.authService.currentUser()?.email;
  }

  logout() {
    this.authService.signOut();
  }
}

import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { ProviderListComponent } from './features/provider-list/provider-list.component';
import { ChatComponent } from './features/chat/chat.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'providers', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'providers', component: ProviderListComponent },
  { path: 'chat/:id', component: ChatComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: 'providers' }
];

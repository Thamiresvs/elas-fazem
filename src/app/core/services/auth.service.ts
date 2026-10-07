import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService).client;
  private router = inject(Router);

  currentUser = signal<User | null>(null);

  constructor() {
    this.supabase.auth.getSession().then(({ data }) => {
      this.currentUser.set(data.session?.user ?? null);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  async signUp(email: string, pass: string, fullName: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password: pass
    });
    if (error) throw error;
    this.router.navigate(['/providers']);
    return data;
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}

import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from 'src/environments/environments';


export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  is_provider: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  currentUser = signal<User | null>(null);
  userProfile = signal<UserProfile | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    this.supabase.auth.getUser().then(({ data }) => {
      this.currentUser.set(data.user);
      if (data.user) this.fetchUserProfile(data.user.id);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser.set(session?.user ?? null);
      if (session?.user) {
        this.fetchUserProfile(session.user.id);
      } else {
        this.userProfile.set(null);
      }
    });
  }

  async fetchUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      this.userProfile.set(data as UserProfile);
    } else if (!data) {
      console.warn('Perfil não encontrado para o utilizador:', userId);
    }
  }

  async signUp(email: string, password: string, fullName: string, isProvider: boolean = false) {
  const { data, error } = await this.supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        is_provider: isProvider
      }
    }
  });

  if (error) throw error;

  if (data.user) {
    await this.supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      is_provider: isProvider
    });

    await this.fetchUserProfile(data.user.id);
  }

  return data;
}

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (data.user) await this.fetchUserProfile(data.user.id);
    return data;
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.currentUser.set(null);
    this.userProfile.set(null);
  }
}

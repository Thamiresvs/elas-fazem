import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { Provider } from '../models/app.models';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private supabase: SupabaseClient;
  providers = signal<Provider[]>([]);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    this.fetchProviders();
  }

  // Busca prestadoras chamando a RPC ou via SELECT direto de fallback
  async fetchProviders() {
    try {
      const { data, error } = await this.supabase
        .rpc('get_nearby_providers', {
          user_lat: -22.9068,
          user_lng: -43.1729,
          radius_km: 100
        });

      if (error || !data || data.length === 0) {
        console.warn('RPC não retornou dados. Executando busca direta...');
        this.fetchProvidersDirect();
        return;
      }

      this.providers.set(data as Provider[]);
    } catch (e) {
      console.error('Erro na requisição RPC:', e);
      this.fetchProvidersDirect();
    }
  }

  // Fallback: Busca direta nas tabelas providers e profiles
  private async fetchProvidersDirect() {
    const { data, error } = await this.supabase
      .from('providers')
      .select(`
        id,
        category,
        bio,
        rating,
        hourly_rate,
        profiles!inner (
          full_name,
          avatar_url
        )
      `);

    if (error) {
      console.error('Erro ao buscar diretamente:', error);
      return;
    }

    if (data) {
      const mapped: Provider[] = data.map((item: any) => ({
        id: item.id,
        full_name: item.profiles?.full_name || 'Profissional',
        avatar_url: item.profiles?.avatar_url || '',
        category: item.category,
        bio: item.bio,
        rating: item.rating,
        hourly_rate: item.hourly_rate,
        distance_km: 2.5
      }));
      this.providers.set(mapped);
    }
  }

  async searchNearbyProviders(lat: number, lng: number) {
    const { data, error } = await this.supabase
      .rpc('get_nearby_providers', {
        user_lat: lat,
        user_lng: lng,
        radius_km: 100
      });

    if (!error && data && data.length > 0) {
      this.providers.set(data as Provider[]);
    } else {
      this.fetchProvidersDirect();
    }
  }
}

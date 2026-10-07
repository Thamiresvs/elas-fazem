import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Provider } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private supabase = inject(SupabaseService).client;

  providers = signal<Provider[]>([]);
  loading = signal<boolean>(false);

  async searchNearbyProviders(userLat: number, userLng: number, radiusKm: number = 15) {
    this.loading.set(true);

    const { data, error } = await this.supabase.rpc('get_nearby_providers', {
      user_lat: userLat,
      user_lng: userLng,
      radius_km: radiusKm
    });

    this.loading.set(false);

    if (error) {
      console.warn('Usando lista de demonstração.');
      return;
    }

    if (data && data.length > 0) {
      this.providers.set(data as Provider[]);
    }
  }
}

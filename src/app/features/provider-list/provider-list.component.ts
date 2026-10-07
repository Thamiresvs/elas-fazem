import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProviderService } from 'src/app/core/services/provider.service';
import { Provider } from 'src/app/core/models/app.models';

@Component({
  selector: 'app-provider-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: './provider-list.component.html'
})
export class ProviderListComponent implements OnInit {
  providerService = inject(ProviderService);
  private router = inject(Router);
  searchQuery = '';

  mockProviders = signal<Provider[]>([
    {
      id: '1',
      full_name: 'Camila Alcantara',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      category: 'Hidráulica',
      bio: 'Especialista em instalação de torneiras, desentupimentos e reparos residenciais.',
      rating: 4.9,
      hourly_rate: 90,
      distance_km: 1.8
    },
    {
      id: '2',
      full_name: 'Fernanda Lima',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      category: 'Elétrica',
      bio: 'Eletricista predial e residencial. Troca de fiação, quadros de força e chuveiros.',
      rating: 5.0,
      hourly_rate: 110,
      distance_km: 3.2
    },
    {
      id: '3',
      full_name: 'Juliana Rocha',
      avatar_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200',
      category: 'Pintura',
      bio: 'Pintura decorativa, aplicação de textura, drywall e restauração de superfícies.',
      rating: 4.8,
      hourly_rate: 85,
      distance_km: 4.5
    }
  ]);

  ngOnInit() {
    this.providerService.providers.set(this.mockProviders());
  }

  filteredProviders() {
    const query = this.searchQuery.toLowerCase();
    return this.providerService.providers().filter(p =>
      p.full_name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.bio.toLowerCase().includes(query)
    );
  }

  loadNearbyProviders() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.providerService.searchNearbyProviders(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          this.providerService.searchNearbyProviders(-22.9068, -43.1729);
        }
      );
    }
  }

  openChat(provider: Provider) {
    this.router.navigate(['/chat', provider.id]);
  }
}

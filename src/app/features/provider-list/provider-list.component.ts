import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProviderService } from '../../core/services/provider.service';
import { Provider } from '../../core/models/app.models';

@Component({
  selector: 'app-provider-list',
  standalone: true,
  imports: [CommonModule, NgFor, DecimalPipe, FormsModule],
  templateUrl: './provider-list.component.html'
})
export class ProviderListComponent implements OnInit {
  providerService = inject(ProviderService);
  private router = inject(Router);
  searchQuery = '';

  ngOnInit() {
    // Carrega do Supabase
    this.providerService.fetchProviders();
  }

  filteredProviders() {
    const query = this.searchQuery.toLowerCase();
    return this.providerService.providers().filter(p =>
      p.full_name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.bio && p.bio.toLowerCase().includes(query))
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

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AddressData } from '../../models/address/address-data.model';
import { NominatimResult } from '../../models/address/nominatim-result.model';

@Injectable({ providedIn: 'root' })
export class NominatimService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://nominatim.openstreetmap.org';

  search(query: string, limit: number = 5): Observable<NominatimResult[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('format', 'json')
      .set('addressdetails', '1')
      .set('limit', limit.toString())
      .set('accept-language', 'es,en,pt');

    return this.http.get<NominatimResult[]>(`${this.baseUrl}/search`, { params });
  }

  reverse(lat: number, lon: number): Observable<NominatimResult> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('format', 'json')
      .set('addressdetails', '1')
      .set('accept-language', 'es,en,pt');

    return this.http.get<NominatimResult>(`${this.baseUrl}/reverse`, { params });
  }

  toAddressData(result: NominatimResult): AddressData {
    const addr = result.address;
    return {
      address: result.display_name,
      city: addr.city || addr.town || addr.village || '',
      country: addr.country || '',
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    };
  }
}

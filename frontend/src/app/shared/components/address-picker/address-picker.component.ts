import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  takeUntil
} from 'rxjs';

import * as L from 'leaflet';

import { AddressData } from '../../../core/models/address/address-data.model';
import { NominatimResult } from '../../../core/models/address/nominatim-result.model';
import { NominatimService } from '../../../core/services/nominatim/nominatim.service';

@Component({
  standalone: true,
  selector: 'app-address-picker',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './address-picker.component.html',
  styleUrl: './address-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressPickerComponent),
      multi: true
    }
  ]
})
export class AddressPickerComponent
  implements AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor
{
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  @Input() initialValue: AddressData | null = null;
  @Output() addressSelected = new EventEmitter<AddressData>();

  private readonly nominatim = inject(NominatimService);
  private readonly destroy$ = new Subject<void>();

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly suggestions = signal<NominatimResult[]>([]);
  readonly searching = signal(false);
  readonly selectedAddress = signal<AddressData | null>(null);
  readonly isMoving = signal(false);
  readonly geolocating = signal(false);
  readonly geolocationError = signal<string | null>(null);

  private onChange: (value: AddressData | null) => void = () => {};
  private onTouched: () => void = () => {};

  private map: L.Map | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private programmaticMove = false;

  private readonly defaultLat = 6.2476;
  private readonly defaultLng = -75.5658;

  ngAfterViewInit(): void {
    this.initMap();
    this.setupSearchAutocomplete();

    if (this.initialValue) {
      this.applyAddressData(this.initialValue, true, false);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && this.map && this.initialValue) {
      this.applyAddressData(this.initialValue, true, false);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  writeValue(value: AddressData | null): void {
    if (value && this.map) {
      this.applyAddressData(value, true, false);
    } else if (value) {
      this.initialValue = value;
    }
  }

  registerOnChange(fn: (value: AddressData | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private initMap(): void {
    const lat = this.initialValue?.latitude ?? this.defaultLat;
    const lng = this.initialValue?.longitude ?? this.defaultLng;

    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: true,
      attributionControl: true
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.map.on('movestart', () => {
      if (!this.programmaticMove) {
        this.isMoving.set(true);
      }
    });

    this.map.on('moveend', () => {
      if (this.programmaticMove) {
        this.programmaticMove = false;
        this.isMoving.set(false);
        return;
      }
      this.isMoving.set(false);
      const center = this.map!.getCenter();
      this.reverseGeocode(center.lat, center.lng);
    });

    this.observeResize();
    this.scheduleInvalidateSize();
  }

  private observeResize(): void {
    if (typeof ResizeObserver === 'undefined' || !this.map) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.map?.invalidateSize();
    });
    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  private scheduleInvalidateSize(): void {
    requestAnimationFrame(() => {
      this.map?.invalidateSize();
      requestAnimationFrame(() => this.map?.invalidateSize());
    });
    setTimeout(() => this.map?.invalidateSize(), 250);
  }

  private setupSearchAutocomplete(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.trim().length < 3) {
            this.suggestions.set([]);
            return of([] as NominatimResult[]);
          }
          this.searching.set(true);
          return this.nominatim
            .search(query)
            .pipe(catchError(() => of([] as NominatimResult[])));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((results) => {
        this.suggestions.set(results);
        this.searching.set(false);
      });
  }

  onSuggestionSelected(event: MatAutocompleteSelectedEvent): void {
    const result = event.option.value as NominatimResult;
    const data = this.nominatim.toAddressData(result);
    this.applyAddressData(data, true, true);
  }

  displayFn = (result: NominatimResult | string | null): string => {
    if (!result) return '';
    if (typeof result === 'string') return result;
    return result.display_name;
  };

  recenterOnSelection(): void {
    const selected = this.selectedAddress();
    if (!selected || !this.map) return;
    this.programmaticMove = true;
    this.map.flyTo([selected.latitude, selected.longitude], 16, { duration: 0.6 });
  }

  useMyLocation(): void {
    this.geolocationError.set(null);

    if (!navigator.geolocation) {
      this.geolocationError.set('NOT_SUPPORTED');
      return;
    }

    this.geolocating.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.geolocating.set(false);
        if (this.map) {
          this.programmaticMove = true;
          this.map.flyTo([pos.coords.latitude, pos.coords.longitude], 17, { duration: 0.8 });
          this.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        }
      },
      () => {
        this.geolocating.set(false);
        this.geolocationError.set('DENIED');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  private reverseGeocode(lat: number, lng: number): void {
    this.searching.set(true);
    this.nominatim
      .reverse(lat, lng)
      .pipe(
        catchError(() => of(null)),
        takeUntil(this.destroy$)
      )
      .subscribe((result) => {
        this.searching.set(false);
        if (result) {
          const data = this.nominatim.toAddressData(result);
          this.applyAddressData(data, false, true);
          this.searchControl.setValue(data.address, { emitEvent: false });
        }
      });
  }

  private applyAddressData(
    data: AddressData,
    moveMap: boolean,
    emitChange: boolean
  ): void {
    this.selectedAddress.set(data);

    if (moveMap && this.map) {
      this.programmaticMove = true;
      this.map.flyTo([data.latitude, data.longitude], 16, { duration: 0.8 });
      this.searchControl.setValue(data.address, { emitEvent: false });
    }

    if (emitChange) {
      this.addressSelected.emit(data);
      this.onChange(data);
      this.onTouched();
    }
  }
}

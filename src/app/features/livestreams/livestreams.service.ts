// src/app/features/livestreams/livestreams.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Livestream, StartLivestreamDto } from '@core/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LivestreamsService {
  private readonly apiUrl = `${environment.apiUrl}/livestreams`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Livestream[]> {
    return this.http.get<Livestream[]>(this.apiUrl);
  }

  getById(id: string): Observable<Livestream> {
    return this.http.get<Livestream>(`${this.apiUrl}/${id}`);
  }

  start(data: StartLivestreamDto): Observable<Livestream> {
    return this.http.post<Livestream>(`${this.apiUrl}/start`, data);
  }

  end(id: string): Observable<Livestream> {
    return this.http.post<Livestream>(`${this.apiUrl}/${id}/end`, {});
  }

  getActive(): Observable<Livestream | null> {
    return this.http.get<Livestream | null>(`${this.apiUrl}/active`);
  }
}

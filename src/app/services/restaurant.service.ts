import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'https://smarty.kerzz.com:4004/api/mock/getFeed';
  private apiKey = 'bW9jay04ODc3NTU2NjExMjEyNGZmZmZmZmJ2'; // API Anahtarı

  constructor(private http: HttpClient) {}

  getRestaurants(lat: number, lon: number, limit: number, skip: number): Observable<any> {
    const headers = new HttpHeaders().set('apiKey', this.apiKey);
    const body = {
      latitude: lat,
      longitude: lon,
      limit: limit,
      skip: skip
    };
    return this.http.post(this.apiUrl, body, { headers });
  }
}
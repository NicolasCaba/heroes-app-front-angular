import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Heroe } from '../interfaces/heroe.interface';
import { StorageCretedResponse } from '../interfaces/storage-created-response.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HeroeCretedResponse } from '../interfaces/heroe-created-response.interface';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getHeroes(): Observable<Heroe[]> {
    return this.http.get<Heroe[]>(`${this.baseUrl}/heroes`);
  }

  getHeroePorId(id: string): Observable<Heroe[]> {
    return this.http.get<Heroe[]>(`${this.baseUrl}/heroes/name/${id}`);
  }

  getSugerencias(termino: string): Observable<Heroe[]> {
    return this.http.get<Heroe[]>(`${this.baseUrl}/heroes?q=${termino}&_limit=6`)
  }

  agregarStorage(storage: FormData): Observable<StorageCretedResponse> {
    return this.http.post<StorageCretedResponse>(`${this.baseUrl}/storage`, storage);
  }

  agregarHeroe(heroe: any): Observable<HeroeCretedResponse> {
    return this.http.post<HeroeCretedResponse>(`${this.baseUrl}/heroes`, heroe)
  }

  actualizarHeroe(heroe: Heroe, formHeroe: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/heroes/${heroe._id}`, formHeroe);
  }

  eliminarHeroe(idHeroe: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/heroes/${idHeroe}`);
  }

  eliminarStorage(idStorage: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/storage/${idStorage}`);
  }
}

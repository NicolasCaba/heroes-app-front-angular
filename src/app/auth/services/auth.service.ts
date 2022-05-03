import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
import { Auth } from '../interfaces/auth.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _auth: Auth | undefined;

  get auth(): Auth {
    return { ...this._auth! }
  }

  constructor( private http: HttpClient ) { }

  verificarAutenticacion(): Observable<boolean> {
    if (!localStorage.getItem('id')) {
      return of(false);
    }

    return this.http.get<Auth[]>(`${ this.baseUrl }/users/1`)
      .pipe(
        map( auth => {
          this._auth = auth[0];
          return true;
        })
      )
  
  }

  login(): Observable<Auth[]> {
    return this.http.get<Auth[]>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( resp => this._auth = resp[0]),
        tap( resp => localStorage.setItem('id', this.auth.id.toString() ))
      )
  }

  logout() {
    this._auth = undefined;
  }
}

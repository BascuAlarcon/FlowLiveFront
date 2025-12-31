import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry, lastValueFrom, firstValueFrom } from 'rxjs';   
import { CustomHttpInterface } from '@core/interfaces/http.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private readonly URL = environment.API_DOMAINS.URL_COMUNES;
  private readonly URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getUserData(rut: string): Observable<CustomHttpInterface<any>> {
    return this.http.get<CustomHttpInterface<any>>(
      `${this.URL}/attendance-api/participant/get?rut=${rut}`,
    );
  }

  async getUser(tipo: string, rut: string): Promise<any | null> {
    const user = await lastValueFrom(this.getUserData(rut).pipe(retry(1)));
    return user.data;
  }

  async setUserHash(hash: string): Promise<any> {
    return new Promise(async (resolve) => {
      const check = await firstValueFrom(this.checkHash(hash));

      sessionStorage.setItem('dataHash', JSON.stringify(check.data));

      resolve(check.data);
    });
  }

  checkHash(hash: string): Observable<CustomHttpInterface<any>> {
    return this.http.get<CustomHttpInterface<any>>(
      `${this.URL}/attendance-api/participant/check-hash?hash=${hash}`,
    );
  }

  verificarUsuario(data: {
    rut: string;
    type: any;
  }): Observable<CustomHttpInterface<any>> {
    return this.http.post<CustomHttpInterface<any>>(
      `${this.URL}/portal-personas-api/auth/usuarios/verificar`,
      data,
    );
  }

  obtenerEmpresaParticipante(params: {
    identificador: string;
    type: any;
  }): Observable<CustomHttpInterface<any>> {
    let identificador!: string;

    if (params.type === 'RUT') {
      identificador = params.identificador?.split('-')[0] || '';
    } else {
      identificador = params.identificador;
    }

    return this.http.get<CustomHttpInterface<any>>(
      `${this.URL}/integraciones-api/integracion-portal-personas/detalles/obtener-empresa-participante?identificador=${identificador}&type=${params.type}`,
    );
  }

  registrarUsuario(data: {
    identificador: string;
    type: any;
    email: string;
    password: string;
  }): Observable<CustomHttpInterface<any>> {
    return this.http.post<CustomHttpInterface<any>>(
      `${this.URL}/portal-personas-api/mutadores/usuarios/crear`,
      data,
    );
  }
  recuperarPwd(data: {
    identificador: string;
    type: any;
    redirectUri: string;
  }): Observable<CustomHttpInterface<any>> {
    return this.http.post<CustomHttpInterface<any>>(
      `${this.URL}/portal-personas-api/mutadores/usuarios/recuperar-pwd`,
      data,
    );
  }

  // ============ FlowLive API Methods ============

  /**
   * Obtiene la lista de usuarios
   */
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users`);
  }

  /**
   * Obtiene un usuario por ID
   * @param id - ID del usuario
   */
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/${id}`);
  }

  /**
   * Actualiza un usuario
   * @param id - ID del usuario
   * @param data - Datos a actualizar (name, email)
   */
  updateUser(id: string, data: { name?: string; email?: string }): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/users/${id}`, data);
  }
}

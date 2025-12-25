import { Injectable } from '@angular/core';
import { ParticipanteEncuesta, ParticipanteAsistencia, UsuarioPortalPersona, QueryParamsData } from '@core/interfaces/user.interface';
import { UserService } from '@core/services/user.service';
import { TipoIdentificacion } from '@core/types/tipoIdentificacion';
 
import { firstValueFrom } from 'rxjs'; 
// import { TipoIdentificacion } from '../types/tipoIdentificacion';
// import { ParticipanteEncuesta, ParticipanteAsistencia, UsuarioPortalPersona, QueryParamsData } from '../interfaces/user.interface';
// import { UserService } from '../../services/user.service';

interface UserContext {
  participanteEncuesta: ParticipanteEncuesta | null;
  participanteAsistencia: ParticipanteAsistencia | null;
  usuarioPortalPersona: UsuarioPortalPersona;
  dataUsuarioKeycloak: any;
  trabajadorData: any | null;
  partiId: number | null;
}

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private _users: UserContext | null = null;
  private _dataHash: any | null = null;
  private _hash: string | null = null;
  private _queryParamsData: QueryParamsData | null = null;

  constructor(private readonly _userService: UserService) {
    const savedUsers = localStorage.getItem('user');
    if (savedUsers) {
      this._users = JSON.parse(savedUsers);
    }

    const savedHash = localStorage.getItem('dataHash');
    if (savedHash) {
      this._dataHash = JSON.parse(savedHash);
    }

    this._hash = localStorage.getItem('hash');
  }

  // --- USER ----
  get currentUser(): UserContext | null {
    return (
      this._users || (JSON.parse(localStorage.getItem('user')!) as UserContext)
    );
  }

  set currentUser(data: UserContext | null) {
    this._users = data;
    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
    } else {
      localStorage.removeItem('user');
    }
  }

  get partiId(): number {
    return this._users?.partiId as number;
  }

  // --- DATA HASH ---
  get dataHash(): any | null {
    return this._dataHash;
  }

  set dataHash(data: any | null) {
    this._dataHash = data;
    if (data) {
      localStorage.setItem('dataHash', JSON.stringify(data));
    } else {
      localStorage.removeItem('dataHash');
    }
  }

  // --- HASH ---
  get hash(): string | null {
    return this._hash;
  }

  set hash(value: string | null) {
    this._hash = value;
    if (value) {
      localStorage.setItem('hash', value);
    } else {
      localStorage.removeItem('hash');
    }
  }

  get queryParamsData(): QueryParamsData | null {
    return this._queryParamsData;
  }
  set queryParamsData(value: QueryParamsData) {
    this._queryParamsData = value;
  }
 
  // --- ACCESSOR extra ---
  get accaId(): number {
    return this._dataHash?.action_config?.acca_id as number;
  }

  // --- LIMPIAR ---
  clear(): void {
    this._users = null;
    this._hash = null;
    this._dataHash = null;
    localStorage.removeItem('user');
    localStorage.removeItem('hash');
    localStorage.removeItem('dataHash');
  }

  async getUserData() {
    // Verificar que currentUser exista
    if (!this.currentUser) {
      throw new Error('No hay usuario en contexto');
    }

    const userPortalPersona = this.currentUser.usuarioPortalPersona;

    const { usu_identificador, usu_tipo_identificacion } = userPortalPersona;

    try {
      const data = await firstValueFrom(
        this._userService.obtenerEmpresaParticipante({
          identificador: usu_identificador as string,
          type: usu_tipo_identificacion as TipoIdentificacion,
        }),
      );

      if (data?.data) {
        this.currentUser = {
          ...this.currentUser,
          trabajadorData: data.data,
        };
      }

      return data.data;
    } catch (error) {
      console.error('Error al obtener datos del participante:', error);
      throw error;
    }
  }
}

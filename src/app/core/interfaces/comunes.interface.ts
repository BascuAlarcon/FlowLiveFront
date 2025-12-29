export interface TiposProceso {
  tproId: number;
  tproNombre: string;
}

export interface Empresa {
  emprCodigo: number;
  empNombre: string;
}

export interface Confidencialidad {
  confId: number;
  confNombre: string;
  confActivo: boolean;
}

export interface TipoBusqueda {
  tbuId: number;
  tbuNombre: string;
}

export interface Motivos {
  motId: number;
  motNombre: string;
}

export interface Modalidad {
  modaId: number;
  modaNombre: string;
}

export interface Jornada {
  jorId: number;
  jorNombre: string;
}

export interface MinutosColacion {
  mincolId: number;
  mincolNombre: string;
  mincolCantidad: number;
}

export interface CentroCosto {
  cecoId: number;
  cecoNombre: string;
}

export interface Zona {
  zonId: number;
  zonNombre: string;
}

export interface Gerencia {
  gerId: number;
  gerNombre: string;
}

export interface Oficina {
  ofiId: number;
  ofiNombre: string;
}

export interface Area {
  areaId: number;
  areaNombre: string;
}

export interface Ejecutivo {
  ejecId: number;
  ejecNombre: string;
  ejecEmail: string;
  zonId: number;
  ofiId: number;
}

export interface EstadosSolicitud {
  essolId: number;
  essolNombre: string;
}

export interface HorarioLaboral {
  horlabId?: number;
  solId: number;
  horlabDiaSemana: string | null;
  horlabEntrada: Date | null;
  horlabSalida: Date | null;
  horlabCantidadHoras: number | null;
}

export interface Habilidad {
  habId: number;
  habNombre: string | null;
  habOrden?: number;
}

export interface TipoRol {
  trolId: number;
  trolNombre: string;
}

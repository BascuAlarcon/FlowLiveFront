import { Ejecutivo, Empresa, EstadosSolicitud, HorarioLaboral, TiposProceso } from './comunes.interface';

export interface SolicitudModelBase {
  solId: number;
  tproId: number;
  confId: number;
  tbuId: number;
  solCargoSolicitar: string;
  gerId: number;
  areaId: number;
  motId: number;
  modaId: number;
  jorId: number;
  mincolId: number;
  solSueldoBase: number;
  ejecId: number;
  cecoId: number;

  trolId: number;

  emprCodigo: number | null;
  essolId: number;
  solNombreContactoEmpresa: string;
  solTelefonoContactoEmpresa: number;
  solEmailContactoEmpresa: string;
  solFechaSolicitud: string;
  solFechaCreacion: string;
  solFechaTentativaIngreso: string;
  solNombreJefatura: string;
  solDescripcionFunciones: string;
  solRequerimientosTecnicos: string;
  solExperiencia: string;
  solCaracteristicasGeneral: string;
  solCaracteristicasJefe: string;
  solCantidadVacantes: number;

  solEjecutivoCustomNombre: string | null;
  solEjecutivoCustomEmail: string | null;
  solEjecutivoCustomOficina: number | null;
  solEjecutivoCustomZona: number | null;

  modaOficinaId: number | null;
  solEmailJefatura: string | null;
  solOficinaIdJefatura: number | null;
  solZonaIdJefatura: number | null;
}

export interface ResponseListadoSolicitud {
  solId: Pick<SolicitudModelBase, 'solId'>;
  solCargoSolicitar: Pick<SolicitudModelBase, 'solCargoSolicitar'>;
  solFechaSolicitud: Pick<SolicitudModelBase, 'solFechaSolicitud'>;
  tipoProceso: TiposProceso;
  estadosSolicitud: EstadosSolicitud;
  empresa: Empresa;
}

export interface ResponseDetalleSolicitud extends SolicitudModelBase {
  tipoProceso: TiposProceso;
  empresa: Empresa;
  estadosSolicitud: EstadosSolicitud;
  horariolaborals: HorarioLaboral[];
  solicitudHabilidades: SolicitudHabilidad[];
  ejecutivo: Ejecutivo;
}

export interface SolicitudHabilidad {
  solId: number;
  habId?: number;
  solHabNombreHabilidadOtro: string | null;
  solhabOrden: number | null;
  solHabId: number | null;
}

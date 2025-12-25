import { TipoIdentificacion } from "../types/tipoIdentificacion";

export interface ParticipanteAsistencia {
  par_id: number;
  par_rut: string | null;
  par_tipo_identificacion: TipoIdentificacion | null;
  par_trab_id: number | null;
  par_part_id_gn: number | null;
  par_trab_nombres: string | null;
  par_trab_apellido_materno: string | null;
  par_trab_apellido_paterno: string | null;
  par_codigo_empresa: number | null;
  par_nombre_empresa: string | null;
  par_activo: boolean;
  par_created_at: Date;
  par_updated_at: Date | null;
}

export interface UsuarioPortalPersona {
  usu_id: number;
  usu_identificador: string | null;
  usu_email: string | null;
  usu_tipo_identificacion: TipoIdentificacion | null;
  usu_uuid: string | null;
  usu_clave: string | null;
  usu_activo: boolean;
  usu_created_at: Date;
  usu_updated_at: Date | null;
}

export interface ParticipanteEncuesta {
  parti_id: number;
  parti_nombre: string;
  parti_rut: string;
  parti_telefono: string;
  parti_email: string;
  parti_esExtranjero: number;
  parti_id_gn: number;
}

export interface QueryParamsData {
  rut?: string;
  origen?: "asistencia" | "encuesta";
  acca_id?: string;
  tipo_doc?: TipoIdentificacion;
  uuidEncuesta?: string;
  enc_id?: number;
  encparti_id?: number;
}

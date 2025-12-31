import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface Attribute {
  id: string;
  categoryId: string;
  name: string;
  type: string;
  isRequired: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AttributeValue {
  id: string;
  attributeId: string;
  value: string;
  hexCode?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttributeDto {
  name: string;
  type: string;
  isRequired: boolean;
  order: number;
}

export interface UpdateAttributeDto {
  name?: string;
  required?: boolean;
}

export interface CreateAttributeValueDto {
  value: string;
  hexCode?: string;
  order: number;
}

export interface UpdateAttributeValueDto {
  value?: string;
  hexCode?: string;
  order?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttributesService {
  private readonly apiUrl = `${environment.apiUrl}/attributes`;
  private readonly categoriesUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene un atributo por ID
   * @param id - ID del atributo
   */
  getById(id: string): Observable<Attribute> {
    return this.http.get<Attribute>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo atributo para una categoría
   * @param categoryId - ID de la categoría
   * @param data - Datos del atributo
   */
  create(categoryId: string, data: CreateAttributeDto): Observable<Attribute> {
    return this.http.post<Attribute>(`${this.categoriesUrl}/${categoryId}/attributes`, data);
  }

  /**
   * Actualiza un atributo
   * @param id - ID del atributo
   * @param data - Datos a actualizar
   */
  update(id: string, data: UpdateAttributeDto): Observable<Attribute> {
    return this.http.put<Attribute>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Elimina un atributo
   * @param id - ID del atributo
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene los valores de un atributo
   * @param attributeId - ID del atributo
   */
  getValues(attributeId: string): Observable<AttributeValue[]> {
    return this.http.get<AttributeValue[]>(`${this.apiUrl}/${attributeId}/values`);
  }

  /**
   * Crea un nuevo valor para un atributo
   * @param attributeId - ID del atributo
   * @param data - Datos del valor
   */
  createValue(attributeId: string, data: CreateAttributeValueDto): Observable<AttributeValue> {
    return this.http.post<AttributeValue>(`${this.apiUrl}/${attributeId}/values`, data);
  }

  /**
   * Obtiene un valor de atributo por ID
   * @param id - ID del valor
   */
  getValueById(id: string): Observable<AttributeValue> {
    return this.http.get<AttributeValue>(`${this.apiUrl}/values/${id}`);
  }

  /**
   * Actualiza un valor de atributo
   * @param id - ID del valor
   * @param data - Datos a actualizar
   */
  updateValue(id: string, data: UpdateAttributeValueDto): Observable<AttributeValue> {
    return this.http.put<AttributeValue>(`${this.apiUrl}/values/${id}`, data);
  }

  /**
   * Elimina un valor de atributo
   * @param id - ID del valor
   */
  deleteValue(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/values/${id}`);
  }
}

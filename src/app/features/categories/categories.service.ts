// src/app/features/categories/categories.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { 
  ProductCategory, 
  CreateCategoryDto, 
  UpdateCategoryDto,
  CategoryAttribute,
  CreateCategoryAttributeDto,
  AttributeValue,
  CreateAttributeValueDto
} from '@core/models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las categorías
   */
  getAll(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.apiUrl);
  }

  /**
   * Obtener una categoría por ID (incluye atributos)
   */
  getById(id: string): Observable<ProductCategory> {
    return this.http.get<ProductCategory>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener atributos de una categoría
   */
  getAttributes(categoryId: string): Observable<CategoryAttribute[]> {
    return this.http.get<CategoryAttribute[]>(`${this.apiUrl}/${categoryId}/attributes`);
  }

  /**
   * Crear una nueva categoría
   */
  create(category: CreateCategoryDto): Observable<ProductCategory> {
    return this.http.post<ProductCategory>(this.apiUrl, category);
  }

  /**
   * Actualizar una categoría
   */
  update(id: string, category: UpdateCategoryDto): Observable<ProductCategory> {
    return this.http.patch<ProductCategory>(`${this.apiUrl}/${id}`, category);
  }

  /**
   * Eliminar una categoría
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un atributo para una categoría
   */
  createAttribute(categoryId: string, attribute: CreateCategoryAttributeDto): Observable<CategoryAttribute> {
    return this.http.post<CategoryAttribute>(`${this.apiUrl}/${categoryId}/attributes`, attribute);
  }

  /**
   * Actualizar un atributo
   */
  updateAttribute(attributeId: string, attribute: Partial<CreateCategoryAttributeDto>): Observable<CategoryAttribute> {
    return this.http.patch<CategoryAttribute>(`${environment.apiUrl}/attributes/${attributeId}`, attribute);
  }

  /**
   * Eliminar un atributo
   */
  deleteAttribute(attributeId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/attributes/${attributeId}`);
  }

  /**
   * Agregar un valor a un atributo
   */
  addAttributeValue(attributeId: string, value: CreateAttributeValueDto): Observable<AttributeValue> {
    return this.http.post<AttributeValue>(`${environment.apiUrl}/attributes/${attributeId}/values`, value);
  }

  /**
   * Actualizar un valor de atributo
   */
  updateAttributeValue(valueId: string, value: Partial<CreateAttributeValueDto>): Observable<AttributeValue> {
    return this.http.patch<AttributeValue>(`${environment.apiUrl}/attributes/values/${valueId}`, value);
  }

  /**
   * Eliminar un valor de atributo
   */
  deleteAttributeValue(valueId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/attributes/values/${valueId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Module } from '../constants/module.model';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private apiUrl = 'http://localhost:8080/api/modules';

  constructor(private http: HttpClient) {}

  getAllModules(): Observable<Module[]> {
    return this.http.get<Module[]>(this.apiUrl);
  }

  addModule(module: Module): Observable<Module> {
    return this.http.post<Module>(this.apiUrl, module);
  }

  getModuleByModuleCode(moduleCode: string): Observable<Module> {
    return this.http.get<Module>(this.apiUrl + '/getByCode', {
      params: { moduleCode },
    });
  }

  deleteModule(moduleCode: string): Observable<void> {
    const params = new HttpParams().set('moduleCode', moduleCode);
    return this.http.delete<void>(this.apiUrl, { params });
  }
}

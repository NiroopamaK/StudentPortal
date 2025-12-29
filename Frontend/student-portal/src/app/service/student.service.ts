import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../constants/student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) {}

  getAllStudents(moduleCode: string): Observable<Student[]> {
    const params = new HttpParams().set('moduleCode', moduleCode);
    return this.http.get<Student[]>(this.apiUrl, { params });
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  addStudents(students: Student[]): Observable<Student[]> {
    return this.http.post<Student[]>(this.apiUrl + '/loadFromFile', students);
  }
  deleteStudent(studentId: string): Observable<void> {
    const params = new HttpParams().set('studentId', studentId);
    return this.http.delete<void>(this.apiUrl, { params });
  }
}

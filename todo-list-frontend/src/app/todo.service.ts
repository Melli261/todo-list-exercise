import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Todo {
  id: number;
  task: string;
  priority: 1 | 2 | 3;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  // besser: environment.apiBase + '/todos'
  private apiUrl = 'http://localhost:8099/api/todos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Error fetching todos', err);
        return throwError(() => err);
      })
    );
  }

  create(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      catchError(err => {
        console.error('Error creating todo', err);
        return throwError(() => err);
      })
    );
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Error deleting todo', err);
        return throwError(() => err);
      })
    );
  }
}

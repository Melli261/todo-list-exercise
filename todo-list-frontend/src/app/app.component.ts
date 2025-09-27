import {Component} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {Observable, BehaviorSubject, combineLatest} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-root',
  template: `
    <div class="title">
      <h1>
        A list of TODOs
      </h1>
    </div>
    <div class="list">
      <label for="search">Search...</label>
      <input id="search" type="text" [(ngModel)]="searchText" (ngModelChange)="onSearchChange($event)">
      <div *ngIf="errorMsg" class="error">{{ errorMsg }}</div>
      <app-progress-bar *ngIf="loading"></app-progress-bar>
      <app-todo-item *ngFor="let todo of todos$ | async" [item]="todo" (delete)="onDelete($event)"></app-todo-item>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  readonly todos$: Observable<Todo[]>;
  loading = true;
  searchText = '';
  errorMsg = '';
  private searchText$ = new BehaviorSubject<string>('');
  private todosList: Todo[] = [];
  private todosList$ = new BehaviorSubject<Todo[]>([]);
  private todoService: TodoService;

  constructor(todoService: TodoService) {
    this.todoService = todoService;
    todoService.getAll().subscribe({
      next: (todos) => {
        this.todosList = todos;
        this.todosList$.next(todos);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
    this.todos$ = combineLatest([
      this.todosList$,
      this.searchText$
    ]).pipe(
      map(([todos, search]) => {
        if (!search) return todos;
        return todos.filter(todo => todo.task.toLowerCase().includes(search.toLowerCase()));
      })
    );
  }

  onSearchChange(value: string) {
    this.searchText$.next(value);
  }

  onDelete(id: number) {
    this.errorMsg = '';
    this.loading = true;
    this.todoService.remove(id).subscribe({
      next: () => {
        this.todosList = this.todosList.filter(todo => todo.id !== id);
        this.todosList$.next(this.todosList);
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to delete TODO. Please try again.';
        this.loading = false;
      }
    });
  }
}

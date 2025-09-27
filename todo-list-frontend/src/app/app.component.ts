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
      <app-progress-bar *ngIf="loading"></app-progress-bar>
      <app-todo-item *ngFor="let todo of todos$ | async" [item]="todo"></app-todo-item>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  readonly todos$: Observable<Todo[]>;
  loading = true;
  searchText = '';
  private searchText$ = new BehaviorSubject<string>('');

  constructor(todoService: TodoService) {
    const allTodos$ = todoService.getAll();
    this.todos$ = combineLatest([
      allTodos$,
      this.searchText$
    ]).pipe(
      map(([todos, search]) => {
        this.loading = false;
        if (!search) return todos;
        return todos.filter(todo => todo.task.toLowerCase().includes(search.toLowerCase()));
      })
    );
    allTodos$.subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  onSearchChange(value: string) {
    this.searchText$.next(value);
  }
}

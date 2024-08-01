import { Component, OnInit } from '@angular/core';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: boolean;
  dateAdded: Date;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: string = '';
  filter: string = 'all';
  showUndo: boolean = false;
  lastDeletedTodo: Todo | null = null;

  ngOnInit() {
    this.loadTodos();
  }

  addTodo() {
    if (this.newTodo.trim() === '') return;

    const newTask: Todo = {
      id: Date.now(),
      title: this.newTodo,
      completed: false,
      priority: false,
      dateAdded: new Date()
    };

    this.todos.push(newTask);
    this.saveTodos();
    this.newTodo = '';
  }

  deleteTodo(id: number) {
    this.lastDeletedTodo = this.todos.find(todo => todo.id === id) || null;
    this.showUndo = true;
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
    setTimeout(() => {
      this.showUndo = false;
      this.lastDeletedTodo = null;
    }, 5000);
  }

  toggleCompletion(id: number) {
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
    }
  }

  togglePriority(id: number) {
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.priority = !todo.priority;
      this.saveTodos();
    }
  }

  editTodo(id: number, event: FocusEvent) {
    const inputElement = event.target as HTMLElement;
    const newTitle = inputElement.innerText.trim();

    if (newTitle === '') return;

    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.title = newTitle;
      this.saveTodos();
    }
  }

  get filteredTodos() {
    if (this.filter === 'completed') {
      return this.todos.filter(todo => todo.completed);
    } else if (this.filter === 'incomplete') {
      return this.todos.filter(todo => !todo.completed);
    } else {
      return this.todos;
    }
  }

  get completedCount() {
    return this.todos.filter(todo => todo.completed).length;
  }

  get incompleteCount() {
    return this.todos.filter(todo => !todo.completed).length;
  }

  setFilter(filter: string) {
    this.filter = filter;
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }
  }

  undoDelete() {
    if (this.lastDeletedTodo) {
      this.todos.push(this.lastDeletedTodo);
      this.lastDeletedTodo = null;
      this.showUndo = false;
      this.saveTodos();
    }
  }
}

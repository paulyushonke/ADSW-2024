// memento.ts
import { type AppState } from "../types";

export class Memento {
  constructor(private state: AppState) {}

  getState(): AppState {
    return this.state;
  }
}

export class Originator {
  private state: AppState;

  constructor(initialState: AppState) {
    this.state = initialState;
  }

  setState(state: AppState): void {
    this.state = state;
  }

  getState(): AppState {
    return this.state;
  }

  saveToMemento(): Memento {
    return new Memento({ ...this.state });
  }

  restoreFromMemento(memento: Memento): void {
    this.state = memento.getState();
  }
}

export class Caretaker {
  private mementos: Memento[] = [];
  private currentIndex = -1;

  addMemento(memento: Memento): void {
    this.mementos = this.mementos.slice(0, this.currentIndex + 1);
    this.mementos.push(memento);
    this.currentIndex++;
  }

  getMemento(index: number): Memento | null {
    if (index >= 0 && index < this.mementos.length) {
      return this.mementos[index]!;
    }
    return null;
  }

  undo(): Memento | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.mementos[this.currentIndex]!;
    }
    return null;
  }

  redo(): Memento | null {
    if (this.currentIndex < this.mementos.length - 1) {
      this.currentIndex++;
      return this.mementos[this.currentIndex]!;
    }
    return null;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  private nameVisibleSource = new BehaviorSubject<boolean>(true);
  private resetTextsSource = new BehaviorSubject<boolean>(false);

  nameVisible$ = this.nameVisibleSource.asObservable();
  resetTexts$ = this.resetTextsSource.asObservable();

  constructor() { }

  setNameVisibility(visible: boolean) {
    this.nameVisibleSource.next(visible);
  }

  resetTexts() {
    this.resetTextsSource.next(true);
  }
}

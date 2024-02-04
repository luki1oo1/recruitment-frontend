import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArrowRotationService {
  private isArrowRotatedSubject = new BehaviorSubject<boolean>(false);
  isArrowRotated$: Observable<boolean> = this.isArrowRotatedSubject.asObservable();

  getIsArrowRotated() {
    return this.isArrowRotatedSubject.value;
  }

  toggleArrowRotation() {
    const currentRotation = this.isArrowRotatedSubject.value;
    this.isArrowRotatedSubject.next(!currentRotation);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsActiveHeaderService {
  private activeHeaderSubject: BehaviorSubject<boolean>;

  $activeHeader;

  constructor() {
    const saved = localStorage.getItem('activeHeader');
    const initial = saved === 'true' ? true : false;
    this.activeHeaderSubject = new BehaviorSubject<boolean>(initial);
    this.$activeHeader = this.activeHeaderSubject.asObservable();
  }

  updateActiveHeader(isActive: boolean) {
    this.activeHeaderSubject.next(isActive);
    localStorage.setItem('activeHeader', isActive.toString());
  }

  toggleActiveHeader() {
    const current = this.activeHeaderSubject.value;
    this.updateActiveHeader(!current);
  }
}

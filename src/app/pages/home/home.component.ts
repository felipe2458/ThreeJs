import { Component, HostListener } from '@angular/core';
import { IonRouterOutlet } from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonRouterOutlet,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent{
  activeHeader: boolean = true;

  constructor(){
    const activeHeader = localStorage.getItem('activeHeader');

    if(activeHeader) this.activeHeader = activeHeader === 'true';
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent){
    if(e.ctrlKey && e.shiftKey && e.key === 'F'){
      this.activeHeader = !this.activeHeader;
      localStorage.setItem('activeHeader', this.activeHeader.toString());
    }
  }
}

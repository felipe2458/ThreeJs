import { Component, HostListener } from '@angular/core';
import { IonRouterOutlet } from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';
import { IsActiveHeaderService } from '../../services/isActiveHeader/is-active-header.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonRouterOutlet,
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent{
  activeHeader: boolean = true;

  constructor(public isActiveHeaderService: IsActiveHeaderService){
    const activeHeader = localStorage.getItem('activeHeader');

    if(activeHeader) this.activeHeader = activeHeader === 'true';
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent){
    if(e.ctrlKey && e.shiftKey && e.key === 'F'){
      this.isActiveHeaderService.toggleActiveHeader();
    }
  }
}

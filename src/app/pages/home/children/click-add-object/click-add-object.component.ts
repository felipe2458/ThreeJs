import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { IsActiveHeaderService } from 'src/app/services/isActiveHeader/is-active-header.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-click-add-object',
  standalone: true,
  imports: [IonRouterOutlet, RouterLink, CommonModule],
  templateUrl: './click-add-object.component.html',
  styleUrls: ['./click-add-object.component.scss'],
})
export class ClickAddObjectComponent{
  activeHeader: boolean = true;

  constructor(private isActiveHeaderService: IsActiveHeaderService){
    this.isActiveHeaderService.$activeHeader.subscribe((isActive) => {
      this.activeHeader = isActive;
    });
  }
}

import { Component } from '@angular/core';
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
  constructor(){}
}

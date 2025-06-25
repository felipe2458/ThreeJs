import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InitialComponent } from './pages/home/children/initial/initial.component';
import { SolarSystemComponent } from './pages/home/children/solar-system/solar-system.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'initial', component: InitialComponent },
      { path: 'solar-system', component: SolarSystemComponent },
      { path: '', redirectTo: 'initial', pathMatch: 'full' },
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InitialComponent } from './pages/home/children/initial/initial.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'initial', component: InitialComponent },
      { path: 'solar-system', loadComponent: () => import('./pages/home/children/solar-system/solar-system.component').then(m => m.SolarSystemComponent) },
      { path: '3dAnimated', loadComponent: () => import('./pages/home/children/animate3d/animate3d.component').then(m => m.Animate3dComponent) },
      { path: 'physics', loadComponent: () => import('./pages/home/children/physics/physics.component').then(m => m.PhysicsComponent) },
      {
        path: 'clickAdd',
        loadComponent: () => import('./pages/home/children/click-add-object/click-add-object.component').then(m => m.ClickAddObjectComponent),
        children: [
          { path: 'initial', loadComponent: () => import('./pages/home/children/click-add-object/children/initial/initial.component').then(m => m.InitialComponent) },
          {
            path: 'free-mode',
            loadComponent: () => import('./pages/home/children/click-add-object/children/free-mode/free-mode.component').then(m => m.FreeModeComponent),
          },
          { path: '', redirectTo: 'initial', pathMatch: 'full' },
        ]
      },
      { path: '', redirectTo: 'initial', pathMatch: 'full' },
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: 'error404',
    loadChildren: () => import('./error404/error404.module').then(m => m.Error404Module)
  },
  {
    path: 'error500',
    loadChildren: () => import('./error500/error500.module').then(m => m.Error500Module)
  },
  {
    path: 'error403',
    loadChildren: () => import('./error403/error403.module').then(m => m.Error403Module)
  },
];

export const routing = RouterModule.forChild(routes);

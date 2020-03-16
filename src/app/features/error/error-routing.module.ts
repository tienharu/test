import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: 'error404',
    loadChildren: './error404/error404.module#Error404Module'
  },
  {
    path: 'error500',
    loadChildren: './error500/error500.module#Error500Module'
  },
  {
    path: 'error403',
    loadChildren: './error403/error403.module#Error403Module'
  },
];

export const routing = RouterModule.forChild(routes);

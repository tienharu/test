
import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from "@angular/router";


export const routes:Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot/forgot.module').then(m => m.ForgotModule)
  },
  {
    path: 'locked',
    loadChildren: () => import('./locked/locked.module').then(m => m.LockedModule)
  },
  {
    path: 'request-join',
    loadChildren: () => import('./request-join/request-join.module').then(m => m.RequestJoinModule)
  },
  {
    path: 'register-company',
    loadChildren: () => import('./register-company/register-company.module').then(m => m.RegisterCompanyModule)
  },
];

export const routing = RouterModule.forChild(routes);

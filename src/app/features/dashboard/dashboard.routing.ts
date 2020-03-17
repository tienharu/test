import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from '@angular/router';
import { AuthGuard } from "@app/core/guards/auth.guard";


export const routes: Routes = [
  {
    path: 'analytics',
    loadChildren:() => import('./analytics/analytics.module').then(m => m.AnalyticsModule),
    data: { 
      pageTitle: 'Analytics Dashboard' 
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'social',
    loadChildren:() => import('./social/social.module').then(m => m.SocialModule),
    data: { 
      pageTitle: 'Social Wall' 
    },
    canActivate: [AuthGuard]
  }
];

export const routing = RouterModule.forChild(routes);

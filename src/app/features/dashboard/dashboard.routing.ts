import {ModuleWithProviders} from "@angular/core"
import {Routes, RouterModule} from '@angular/router';
import { AuthGuard } from "@app/core/guards/auth.guard";


export const routes: Routes = [
  {
    path: 'analytics',
    loadChildren:'./analytics/analytics.module#AnalyticsModule',
    data: { 
      pageTitle: 'Analytics Dashboard' 
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'social',
    loadChildren:'./social/social.module#SocialModule',
    data: { 
      pageTitle: 'Social Wall' 
    },
    canActivate: [AuthGuard]
  }
];

export const routing = RouterModule.forChild(routes);

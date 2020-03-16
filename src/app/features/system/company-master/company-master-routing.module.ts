import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/services';
import { CompanyMasterComponent } from '@app/features/system/company-master/company-master.component';

export const routes: Routes = [
  {
      path: '',
      component: CompanyMasterComponent,
      canDeactivate: [CanDeactivateGuard]
  }
];

export const companyRouting = RouterModule.forChild(routes);

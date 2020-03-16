import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollMasterRoutingModule } from './payroll-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PayrollMasterComponent } from './payroll-master.component';
import {NgxPaginationModule} from 'ngx-pagination'; 

@NgModule({
  imports: [
    CommonModule,
    PayrollMasterRoutingModule,
    Ng2SmartTableModule,
    SharedModule,
    NgxPaginationModule
  ],
  providers: [],
  declarations: [PayrollMasterComponent]
})
export class PayrollMasterModule { }
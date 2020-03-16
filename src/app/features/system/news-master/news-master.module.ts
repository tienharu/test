import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { NewsMasterComponent } from './news-master.component';
import { NewsMasterRoutingModule } from './news-master-routing.module';
import { SmartadminEditorsModule } from '@app/shared/forms/editors/smartadmin-editors.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    NewsMasterRoutingModule,
    SmartadminEditorsModule,
  ],
  providers: [],
  declarations: [NewsMasterComponent]
})
export class NewsMasterModule { }

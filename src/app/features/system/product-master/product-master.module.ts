import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductMasterComponent } from './product-master.component';
import { ProductMasterRoutingModule } from './/product-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    ProductMasterRoutingModule
  ],
  declarations: [ProductMasterComponent]
})
export class ProductMasterModule { }

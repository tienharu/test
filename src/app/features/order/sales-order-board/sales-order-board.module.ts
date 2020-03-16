import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderBoardComponent } from './sales-order-board.component';
import { SalesOrderBoardRoutingModule } from './/sales-order-board-routing.module';
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
    SalesOrderBoardRoutingModule
  ],
  declarations: [SalesOrderBoardComponent]
})
export class SalesOrderBoardModule { }

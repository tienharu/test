import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { MachineRoutingModule } from './attendance-machine-routing.module';
import { MasMachineComponent } from './attendance-machine.component';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';

@NgModule({
  imports: [
    CommonModule,
    MachineRoutingModule,
    SharedModule,
    SmartadminInputModule,
    NgxPaginationModule,
    SmartadminDatatableModule
  ],
  providers: [],
  declarations: [MasMachineComponent]
})
export class MasMachineDataModule { }
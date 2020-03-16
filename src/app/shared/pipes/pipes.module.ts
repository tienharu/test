import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldFilterPipe } from '@app/shared/pipes/field-filter.pipe';
import { MomentPipe } from '@app/shared/pipes/moment.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FieldFilterPipe, MomentPipe],
  exports: [FieldFilterPipe, MomentPipe]
})
export class PipesModule { }

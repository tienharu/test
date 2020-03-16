import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharingInfoComponent } from './sharing-info/sharing-info.component';
import { SmartadminInputModule } from '../forms/input/smartadmin-input.module';
import { I18nModule } from '../i18n/i18n.module';

@NgModule({
  imports: [
    CommonModule,
    SmartadminInputModule,
    I18nModule
  ],
  declarations: [
    SharingInfoComponent
  ],
  exports:[
    SharingInfoComponent
  ]
})
export class CommonSharedModule { }

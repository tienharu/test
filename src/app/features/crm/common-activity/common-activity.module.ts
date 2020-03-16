import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { NgxCurrencyModule } from "ngx-currency";
import { SmartadminEditorsModule } from '@app/shared/forms/editors/smartadmin-editors.module';
import { EmailComponent } from './popup/email/email.component';
import { TelephoneComponent } from './popup/telephone/telephone.component';
import { ConferenceComponent } from './popup/conference/conference.component';
import { IssueComponent } from './popup/issue/issue.component';
import { BusinessStatusComponent } from './popup/business-status/business-status.component';
import { EmailDetailComponent } from './detail/email-detail/email-detail.component';
import { MomentModule } from 'angular2-moment';
import { TelephoneDetailComponent } from './detail/telephone-detail/telephone-detail.component';
import { ConferenceDetailComponent } from './detail/conference-detail/conference-detail.component';
import { IssueDetailComponent } from './detail/issue-detail/issue-detail.component';
import { BusinessStatusDetailComponent } from './detail/business-status-detail/business-status-detail.component';
import { SupportComponent } from './popup/support/support.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    NgxCurrencyModule,
    SmartadminEditorsModule,
    MomentModule,
  ],
  exports: [EmailComponent,TelephoneComponent,ConferenceComponent,IssueComponent, BusinessStatusComponent, EmailDetailComponent, TelephoneDetailComponent, ConferenceDetailComponent,IssueDetailComponent,BusinessStatusDetailComponent, SupportComponent],
  declarations: [EmailComponent,TelephoneComponent,ConferenceComponent,IssueComponent, BusinessStatusComponent, EmailDetailComponent, TelephoneDetailComponent, ConferenceDetailComponent, IssueDetailComponent, BusinessStatusDetailComponent, SupportComponent]
})
export class CommonActivityModule { }

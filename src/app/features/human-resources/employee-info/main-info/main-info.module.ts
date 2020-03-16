import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HRMainInfoRoutingModule } from './main-info-routing.module';
import { HRMainInfoComponent } from './main-info.component';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { HRPersonalBasicComponent } from '../sub-info/personal-basic/personal-basic.component';
import { HRFamilyInfoComponent } from '../sub-info/family-info/family-info.component';
import { HRAcademicInfoComponent } from '../sub-info/academic-info/academic-info.component';
import { HRCareerInfoComponent } from '../sub-info/career-info/career-info.component';
import { HRRewardPunishComponent } from '../sub-info/reward-punish/reward-punish.component';
import { HRTraningInfoComponent } from '../sub-info/traning-info/traning-info.component';
import { HRMedicalInfoComponent } from '../sub-info/medical-info/medical-info.component';
import { HRAppraisalInfoComponent } from '../sub-info/appraisal-info/appraisal-info.component';
import { InsuranceDataComponent } from '../sub-info/insurance-data/insurance-data.component';
import { LastCareComponent } from '../sub-info/career-info/last-care/last-care.component';
import { PathCareComponent } from '../sub-info/career-info/path-care/path-care.component';
import { CertificateComponent } from '../sub-info/career-info/certificate/certificate.component';
import { NewPathCareerComponent } from '../sub-info/career-info/path-care/new-path-career/new-path-career.component';
import { ContractDataComponent } from '../sub-info/contract-data/contract-data.component';
import { MaternityInfoComponent } from '../sub-info/maternity-info/maternity-info.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    HRMainInfoRoutingModule
  ],
  declarations: [HRMainInfoComponent, HRPersonalBasicComponent,HRFamilyInfoComponent,HRAcademicInfoComponent,HRCareerInfoComponent,MaternityInfoComponent,
    HRRewardPunishComponent,HRTraningInfoComponent,HRMedicalInfoComponent,HRAppraisalInfoComponent,InsuranceDataComponent,LastCareComponent, PathCareComponent,CertificateComponent,NewPathCareerComponent,ContractDataComponent]
})
export class HRMainInfoModule { }

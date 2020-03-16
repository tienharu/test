// import { StorageService } from "@app/core/services/storage.service";
// import {
//   AuthTokenFactory,
//   AuthTokenService
// } from "@app/core/services/auth-token.service";

import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { ProgramService } from "@app/core/services/program.service";
import { AuthGuard } from "@app/core/guards/auth.guard";
import { CanDeactivateGuard } from "@app/core/guards/can-deactivate-guard";
import { AuthService } from "@app/core/services/auth.service";
import { RocketChatService } from "@app/core/services/rocket-chat.service";

import { TokenInterceptor } from "@app/core/services/token.interceptor";
import { CompanyMasterService } from "@app/core/services/features.services/company-master.service";
import { SystemMenuService } from "@app/core/services/features.services/system-menu.service";
import { PositionMasterService } from "@app/core/services/features.services/position-master.service";
import { OrganizationMasterService } from "@app/core/services/features.services/organization-master.service";
import { UserMasterService } from "@app/core/services/features.services/user-master.service";
import { RegisterAuthorityGroupService } from "@app/core/services/features.services/register-authority-group.service";
import { AuthorityGroupMenuSettingService } from "@app/core/services/features.services/authority-group-menu-setting.service";
import { UserMenuSettingService } from "@app/core/services/features.services/user-menu-setting.service";
import { UserAuthorityGroupSettingService } from "@app/core/services/features.services/user-authority-group-setting.service";


import { GeneralMasterService } from "@app/core/services/features.services/general-master.service";
import { LanguageSettingService } from "@app/core/services/features.services/language-setting.service";

import { JsonApiService } from "@app/core/api/json-api.service";
import { UserService } from "@app/core/services/user.service";
import { ChatService } from "@app/core/services/chat.service";
import { NotificationService } from "@app/core/services/notification.service";
import { BodyService } from "@app/core/services/body.service";
import { LayoutService } from "@app/core/services/layout.service";
import { SoundService } from "@app/core/services/sound.service";

import * as fromVoice from '@app/core/services/voice';
import { PackageMasterService } from "./features.services/package-master.service";
import { SharingGroupService } from "./features.services/sharing-group.service";
import { MultiLanguageService } from "./mutil-language.service";
import { TraderService } from "./features.services/trader-master.service";
import { HrShiftworkService } from "./hr.services/shiftwork.service";
import { WorkCalendarService } from '@app/core/services/features.services/work-calendar.service';
import { PayrollItemService } from '@app/core/services/hr.services/hr-payroll-item.service';
import { PayrollMasterService } from '@app/core/services/hr.services/hr-payroll-master.service';
import { ContactorService } from "./features.services/contactor-master.service";
import { PagerService } from "@app/core/services/pager.service";
import { crmCustomerDetailService, CrmActivityEmailService } from "./crm/customer-detail.service";
import { AttendanceService } from '@app/core/services/hr.services/hr-attendance.service';
import { DutyTypeService } from '@app/core/services/hr.services/hr-mas-dutytype.service';
import { HrReportService } from '@app/core/services/hr.services/hr-report.service';
import { crmContactorDetailService } from "./crm/contactor-detail.service";
import { NewsService } from "./features.services/news.service";
import { HrMachineDataService } from "./hr.services/hr-mas-machine-data.service";
import { GlobalMasterService } from "./features.services/global-master.service";
import { RoutingMasterService } from "./features.services/routing-master.service";
import { MaterialMasterPopupService } from "./features.services/material-master-popup.service";
import { MaterialMasterService } from "./features.services/material-master-service";
import { WipMasterService } from "./features.services/wip-master.service";
import { ItemMasterService } from "./features.services/item-master-service";
import { ProcessFlowMasterService } from "./features.services/process-flow.service";
import { BomAssyMasterService } from "./features.services/bom-assy-master-service";
import { BomComponentMasterService } from "./features.services/bom-component-master-service";
import { BomMasterPopupService } from "./features.services/bom-master-popup-service";
import { SaleOrderCreateService } from "./features.services/sale-order-create.service";
import { ApprovalLineRegistrationService } from "./features.services/approval-line-reg.service";
import { StyleMasterService } from "./features.services/style-master.service";
import { DownloadImageService } from "./download-image.service";

import { BankBookMasterService } from "./features.services/bank-book-master.service";
import { WorkOrderMasterService } from "./features.services/work-order-master.service";
import { PurchOrderHeaderService } from "./features.services/purch-order-header.service";
import { PurchOrderDetailService } from "./features.services/purch-order-detail.service";
import { PurchOrderWonoService } from "./features.services/purch-order-wono.service";
import { PoSheetService } from "./features.services/po-sheet.service";
import { DueOutMaterialService } from "./features.services/due-out-material.service";
import { InboundStyleService } from "./inbound-style.service";

export const services = [
  CRMSolutionApiService,
  ProgramService,
  // StorageService,
  // AuthTokenService,
  AuthGuard,
  CanDeactivateGuard,
  AuthService,
  RocketChatService,
  TokenInterceptor,
  NotificationService,
  CompanyMasterService,
  SystemMenuService,
  PositionMasterService,
  OrganizationMasterService,
  UserMasterService,
  RegisterAuthorityGroupService,
  AuthorityGroupMenuSettingService,
  UserAuthorityGroupSettingService,
  GeneralMasterService,
  UserMenuSettingService,
  LanguageSettingService,
  JsonApiService,
  UserService,
  ChatService,
  MultiLanguageService,
  BodyService,
  LayoutService,
  SoundService,
  fromVoice.VoiceControlService,
  fromVoice.VoiceRecognitionService,
  PackageMasterService,
  SharingGroupService,
  TraderService,
  HrShiftworkService,
  WorkCalendarService,
  PayrollItemService,
  ContactorService,
  PagerService,
  PayrollMasterService,
  ContactorService,
  crmCustomerDetailService,
  CrmActivityEmailService,
  AttendanceService,
  DutyTypeService,
  crmContactorDetailService,
  CrmActivityEmailService,
  HrReportService,
  NewsService,
  HrMachineDataService,
  GlobalMasterService,
  RoutingMasterService,
  MaterialMasterService,
  MaterialMasterPopupService,
  WipMasterService,
  ItemMasterService,
  ProcessFlowMasterService,
  BomAssyMasterService,
  BomComponentMasterService,
  BomMasterPopupService,
  SaleOrderCreateService,
  ApprovalLineRegistrationService,
  StyleMasterService,
  DownloadImageService,
  BankBookMasterService,
  WorkOrderMasterService,
  PurchOrderHeaderService,
  PurchOrderDetailService,
  PurchOrderWonoService,
  PoSheetService,
  DueOutMaterialService,
  InboundStyleService
];

// export * from "@app/core/services/storage.service";
// export * from "@app/core/services/auth-token.service";

export * from "@app/core/api/crm-solution-api.service";
export * from "@app/core/services/program.service";
export * from "@app/core/guards/auth.guard";
export * from "@app/core/guards/can-deactivate-guard";
export * from "@app/core/services/auth.service";
export * from "@app/core/services/token.interceptor";
// export * from "@app/core/services/features.services/company-master.service";
export * from "@app/core/services/features.services/system-menu.service";
export * from "@app/core/services/features.services/position-master.service";
export * from "@app/core/services/features.services/organization-master.service";
export * from "@app/core/services/features.services/user-master.service";
export * from "@app/core/services/features.services/register-authority-group.service";
export * from "@app/core/services/features.services/authority-group-menu-setting.service";
export * from "@app/core/services/features.services/user-menu-setting.service";
export * from "@app/core/services/features.services/user-authority-group-setting.service";
export * from "@app/core/api/json-api.service";
export * from "@app/core/services/user.service";
export * from "@app/core/services/chat.service";
export * from "@app/core/services/notification.service";
export * from "@app/core/services/body.service";
export * from "@app/core/services/layout.service";
export * from "@app/core/services/sound.service";
export * from "@app/core/services/voice";
export * from "@app/core/services/other.service";
export * from "@app/core/services/features.services/language-setting.service";
export * from "./features.services/package-master.service";
export * from "./hr.services/shiftwork.service";

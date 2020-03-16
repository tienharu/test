import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "@app/core/guards/auth.guard";
import { MainLayoutComponent } from "@app/shared/layout/app-layouts/main-layout.component";
import { AuthLayoutComponent } from "@app/shared/layout/app-layouts/auth-layout.component";
import { EmptyLayoutComponent } from "@app/shared/layout/app-layouts/empty-layout.component";

const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      },
      {
        path: 'home',
        loadChildren: 'app/features/home/home.module#HomeModule',
        data: { pageTitle: 'Home' },
        canActivate: [AuthGuard],
      },
    ]
  },
  {
    path: "",
    component: EmptyLayoutComponent,
    // canActivate: [AuthGuard],
    // data: { pageTitle: "Home" },
    children: [
      // {
      //   path: "",
      //   redirectTo: "home",
      //   pathMatch: "full"
      // },      
      {
        path: "error",
        loadChildren: "app/features/error/error.module#ErrorModule",
        data: { pageTitle: "Error" }
      },
      // home.
      // {
      //   path: 'home',
      //   loadChildren: 'app/features/home/home.module#HomeModule',
      //   data: { pageTitle: 'Home' },
      //   canActivate: [AuthGuard],
      // },

      // dashboard.
      {
        path: "dashboard",
        loadChildren: "app/features/dashboard/dashboard.module#DashboardModule",
        data: { pageTitle: "Dashboard" }
      },

      // register-system-menu.
      {
        path: 'register-system-menu',
        loadChildren: 'app/features/system/system-menu/system-menu.module#SystemMenuModule',
        data: { pageTitle: 'Register System menu' },
        canActivate: [AuthGuard],
      },

      // register-company.
      {
        path: 'register-company',
        loadChildren: 'app/features/system/company-master/company-master.module#CompanyMasterModule',
        data: { pageTitle: 'Register Company' },
        canActivate: [AuthGuard],
      },
      //group sharing master
      {
        path: 'group-sharing-setting',
        loadChildren: 'app/features/system/group-sharing-setting/group-sharing-setting.module#GroupSharingSettingModule',
        canActivate: [AuthGuard],
      },
      //security item setting
      {
        path: 'security-item-setting',
        loadChildren: 'app/features/system/security-item-setting/security-item-setting.module#SecurityItemSettingModule',
        canActivate: [AuthGuard],
      },
      // register-organization.
      {
        path: 'register-organization',
        loadChildren: 'app/features/system/organization-master/organization-master.module#OrganizationMasterModule',
        data: { pageTitle: 'Register Organization' },
        canActivate: [AuthGuard],
      },

      // register-position.
      {
        path: 'register-position',
        loadChildren: 'app/features/system/position-master/position-master.module#PositionMasterModule',
        data: { pageTitle: 'Register Position' },
        canActivate: [AuthGuard],
      },

      // register-user.
      {
        path: 'register-user',
        loadChildren: 'app/features/system/user-master/user-master.module#UserMasterModule',
        data: { pageTitle: 'Register User' },
        canActivate: [AuthGuard],
      },

      // register-authority-group.
      {
        path: 'register-authority-group',
        loadChildren: 'app/features/system/register-authority-group/register-authority-group.module#RegisterAuthorityGroupModule',
        data: { pageTitle: 'Register Authority Group' },
        canActivate: [AuthGuard],
      },

      // authority-group-menu-setting.
      {
        path: 'authority-group-menu-setting',
        loadChildren: 'app/features/system/authority-group-menu-setting/authority-group-menu-setting.module#AuthorityGroupMenuSettingModule',
        data: { pageTitle: 'Authority Group Menu Setting' },
        canActivate: [AuthGuard],
      },

      // user-authority-group-setting.
      {
        path: 'user-authority-group-setting',
        loadChildren: 'app/features/system/user-authority-group-setting/user-authority-group-setting.module#UserAuthorityGroupSettingModule',
        data: { pageTitle: 'User Authority Group Setting' },
        canActivate: [AuthGuard],
      },

      // general-master.
      {
        path: 'general-master',
        loadChildren: 'app/features/system/general-master/general-master.module#GeneralMasterModule',
        data: { pageTitle: 'General Master' },
        canActivate: [AuthGuard],
      },

      // language-setting.
      {
        path: 'language-setting',
        loadChildren: 'app/features/system/language-master/language-master.module#LanguageMasterModule',
        data: { pageTitle: 'Language Setting' },
        canActivate: [AuthGuard],
      },

      // geneal-sys-master
      {
        path: 'general-sys-master',
        loadChildren: 'app/features/system/general-sys-master/general-sys-master.module#GeneralSysMasterModule',
        data: { pageTitle: 'General Sys Master' },
        canActivate: [AuthGuard],
      },
      // account master
      {
        path: 'account-master',
        loadChildren: 'app/features/system/account-master/main-info/main-info.module#MainInfoModule',
        data: { pageTitle: 'Account Master' },
        canActivate: [AuthGuard],
      },
      //transaction code box
      {
        path: 'transaction-code',
        loadChildren: 'app/features/system/transaction-code-box/transaction-code-box.module#TransactionCodeBoxModule',
        data: { pageTitle: 'Transaction-code Box' },
        canActivate: [AuthGuard],
      },
      //packages
      {
        path: 'package-master',
        loadChildren: 'app/features/system/package-master/package-master.module#PackageMasterModule',
        data: { pageTitle: 'Packages Master' },
        canActivate: [AuthGuard],
      },
      {
        path: 'package-menu',
        loadChildren: 'app/features/system/package-menu/package-menu.module#PackageMenuModule',
        data: { pageTitle: 'Packages Menu' },
        canActivate: [AuthGuard],
      },
      // routing-master
      {
        path: 'routing-master',
        loadChildren: 'app/features/system/routing-master/routing-master.module#RoutingMasterModule',
        data: { pageTitle: 'Routing Master' },
        canActivate: [AuthGuard],
      },
      // material-master
      {
        path: 'material-master',
        loadChildren: 'app/features/system/material-master/material-master.module#MaterialMasterModule',
        data: { pageTitle: 'Material Master' },
        canActivate: [AuthGuard],
      },
      // wip-master
      {
        path: 'wip-master',
        loadChildren: 'app/features/system/wip-master/wip-master.module#WipMasterModule',
        data: { pageTitle: 'Wip Master' },
        canActivate: [AuthGuard],
      },
      // product-master
      {
        path: 'product-master',
        loadChildren: 'app/features/system/product-master/product-master.module#ProductMasterModule',
        data: { pageTitle: 'Product Master' },
        canActivate: [AuthGuard],
      },
      // global-master
      {
        path: 'global-master',
        loadChildren: 'app/features/system/global-master/global-master.module#GlobalMasterModule',
        data: { pageTitle: 'Global Master' },
        canActivate: [AuthGuard],
      },
      // bom-master
      {
        path: 'bom-master',
        loadChildren: 'app/features/system/bom-master/bom-master.module#BomMasterModule',
        data: { pageTitle: 'BOM Master' },
        canActivate: [AuthGuard],
      },
      // cus-master
      {
        path: 'customer-new-master',
        loadChildren: 'app/features/system/customer-new-master/customer-new-master.module#CustomerNewMasterModule',
        data: { pageTitle: 'Customer Master' },
        canActivate: [AuthGuard],
      },
      // sales-order-create
      {
        path: 'sales-order-create',
        loadChildren: 'app/features/order/sales-order-create/sales-order-create.module#SalesOrderCreateModule',
        data: { pageTitle: 'Sales Order Create' },
        canActivate: [AuthGuard],
      },
      // sales-order-board
      {
        path: 'sales-order-board',
        loadChildren: 'app/features/order/sales-order-board/sales-order-board.module#SalesOrderBoardModule',
        data: { pageTitle: 'Sales Order Board' },
        canActivate: [AuthGuard],
      },
      // process-flow-master
      {
        path: 'process-flow-master',
        loadChildren: 'app/features/system/process-flow-master/process-flow-master.module#ProcessFlowMasterModule',
        data: { pageTitle: 'Process Flow Master' },
        canActivate: [AuthGuard],
      },
      // item-master
      {
        path: 'item-master',
        loadChildren: 'app/features/system/item-master/item-master.module#ItemMasterModule',
        data: { pageTitle: 'Item Master' },
        canActivate: [AuthGuard],
      },
      // rocket-chat
      {
        path: 'rocket-chat',
        loadChildren: 'app/features/system/rocket-chat/rocket-chat.module#RocketChatModule',
        data: { pageTitle: 'Rocket Chat' },
        canActivate: [AuthGuard],
      },
      // Approval Master
      {
        path: 'approval-line-registration',
        loadChildren: 'app/features/system/approval-line-registration/approval-line-registration.module#ApprovalLineRegistrationModule',
        data: { pageTitle: 'Approval Line Registration' },
        canActivate: [AuthGuard],
      },
      // human-resource.
      {
        path: 'employee-master',
        loadChildren: 'app/features/human-resources/employee-info/main-info/main-info.module#HRMainInfoModule',
        data: { pageTitle: 'Human Resources' },
        canActivate: [AuthGuard],
      },
      {
        path: 'employee-print',
        loadChildren: 'app/features/human-resources/employee-print/employee-print.module#HREmployeePrintModule',
        data: { pageTitle: 'Human Resources' },
        canActivate: [AuthGuard],
      },
      {
        path: 'employee-print-card',
        loadChildren: 'app/features/human-resources/employee-print-card/employee-print-card.module#EmployeePrintCardModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'trader-master',
        loadChildren: 'app/features/master/trader-master/trader-master.module#TraderMasterModule',
        canActivate: [AuthGuard],
      },
      // crm
      {
        path: 'customer-master',
        loadChildren: 'app/features/crm/customer/customer-master/customer-master.module#CustomerMasterModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'customer-detail/:id',
        loadChildren: 'app/features/crm/customer/customer-detail/customer-detail.module#CustomerDetailModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'contactor-detail/:id',
        loadChildren: 'app/features/crm/contactor/contactor-detail/contactor-detail.module#ContactorDetailModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'crm-contactor',
        loadChildren: 'app/features/crm/contactor/contactor-master/contactor-master.module#ContactorMasterModule',
        canActivate: [AuthGuard],
      },

      {
        path: 'crm-payment',
        loadChildren: 'app/features/crm/order-magt/expenses-magt/expenses-magt.module#ExpensesMagtModule',
        canActivate: [AuthGuard],
      },

      {
        path: 'crm-service-item',
        loadChildren: 'app/features/crm/setting/service-item/service-item.module#ServiceItemModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'overtime-table',
        loadChildren: 'app/features/human-resources/overtime-table/overtime-table.module#HrOvertimeTableModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'work-calendar',
        loadChildren: 'app/features/human-resources/work-calendar/work-calendar.module#WorkCalendarModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'annual-leave-register',
        loadChildren: 'app/features/human-resources/annual-leave/annual-leave.module#AnnualLeaveModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'posting-attendance-list',
        loadChildren: 'app/features/human-resources/annual-leave/posting-attendance-list/posting-attendance-list.module#PostingAttendanceListModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'ETL-Machine',
        loadChildren: 'app/features/human-resources/attendance-machine/attendance-machine.module#MasMachineDataModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'shiftwork-register',
        loadChildren: 'app/features/human-resources/shiftwork-register/shiftwork-register.module#ShiftworkRegisterModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'salary-basic',
        loadChildren: 'app/features/human-resources/standard-salary-basic/salary-register.module#SalaryRegisterModule',
        canActivate: [AuthGuard],
      },
      //payroll
      {
        path: 'special-payment',
        loadChildren: 'app/features/human-resources/special-salary/special-salary.module#HrSpecialSalaryModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'payroll-item',
        loadChildren: 'app/features/human-resources/payroll-item/payroll-item.module#PayrollItemModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'payroll-master',
        loadChildren: 'app/features/human-resources/payroll-master/payroll-master.module#PayrollMasterModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'news-master',
        loadChildren: 'app/features/system/news-master/news-master.module#NewsMasterModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'daily-duty-adjust',
        loadChildren: 'app/features/human-resources/daily-attendance/daily-attendance.module#DailyAttendanceModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'personal-duty-adjust',
        loadChildren: 'app/features/human-resources/attendance-person/attendance-person.module#AttendancePersonModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'duty-type',
        loadChildren: 'app/features/human-resources/duty-type/duty-type.module#DutyTypeModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'report-monthly-overtime',
        loadChildren: 'app/features/human-resources/monthly-overtime-report/monthly-overtime-report.module#MonthlyOvertimeReportModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'report-monthly-duty',
        loadChildren: 'app/features/human-resources/monthly-duty-report/monthly-duty-report.module#MonthlyDutyReportModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'report-monthly-attendance',
        loadChildren: 'app/features/human-resources/monthly-attendance-report/monthly-attendance-report.module#MonthlyAttendanceReportModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'report-daily-duty',
        loadChildren: 'app/features/human-resources/daily-duty-report/daily-duty-report.module#DailyDutyReportModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'report-daily-duty-department',
        loadChildren: 'app/features/human-resources/daily-duty-dept-report/daily-duty-dept-report.module#DailyDutyByDeptReportModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'gvn-monthly-attendance',
        loadChildren: 'app/features/human-resources/report/green-vina/gvn-monthly-attendance/gvn-monthly-attendance.module#GvnMonthlyAttendanceModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'gvn-summary-excel',
        loadChildren: 'app/features/human-resources/report/green-vina/summary-excel-download/summary-excel.module#GvnReportSummaryExcelModule',
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'report-monthly-overtime-adidas', 
      //   loadChildren: 'app/features/human-resources/report/adidas/monthly-overtime/adidas-monthly-overtime.module#AdidasMonthlyOvertimeModule', 
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'report-monthy-turnover-rate-adidas', 
      //   loadChildren: 'app/features/human-resources/report/adidas/monthly-turnover/adidas-monthly-turnover.module#AdidasMonthlyTurnoverModule', 
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'crm-sales-opportunity',
        loadChildren: 'app/features/crm/opportunity/opportunity-master/opportunity-master.module#OpportunityMasterModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'opportunity-detail/:id',
        loadChildren: 'app/features/crm/opportunity/opportunity-detail/opportunity-detail.module#OpportunityDetailModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'closing-payroll',
        loadChildren: 'app/features/human-resources/payroll-closing/payroll-closing.module#PayrollClosingModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'crm-project',
        loadChildren: 'app/features/crm/project/project-master/project-master.module#ProjectMasterModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'project-detail/:id',
        loadChildren: 'app/features/crm/project/project-detail/project-detail.module#ProjectDetailModule',
        canActivate: [AuthGuard],
      },
      // style-master
      {
        path: 'style-master',
        loadChildren: 'app/features/system/style-master/style-master.module#StyleMasterModule',
        data: { pageTitle: 'Style Master' },
        canActivate: [AuthGuard],
      },
      // bank-book
      {
        path: 'bank-book',
        loadChildren: 'app/features/system/bank-book/bank-book.module#BankBookModule',
        data: { pageTitle: 'Bank Book' },
        canActivate: [AuthGuard],
      },
      // work-order-master
      {
        path: 'work-order-master',
        loadChildren: 'app/features/system/work-order-master/work-order-master.module#WorkOrderMasterModule',
        data: { pageTitle: 'Work Order Master' },
        canActivate: [AuthGuard],
      },
      // po-sheet
      {
        path: 'po-sheet',
        loadChildren: 'app/features/system/po-sheet/po-sheet.module#PoSheetModule',
        data: { pageTitle: 'PO Sheet' },
        canActivate: [AuthGuard],
      },
      // purch-order
      {
        path: 'purch-order',
        loadChildren: 'app/features/system/purch-order/purch-order.module#PurchOrderModule',
        data: { pageTitle: 'Purch Order' },
        canActivate: [AuthGuard],
      },
      //purchasing
      {
        path: 'purchasing',
        loadChildren: 'app/features/system/purchasing-magt/purchasing-magt.module#PurchasingModule',
        data: { pageTitle: 'Purchasing' },
        canActivate: [AuthGuard],
      },
      //due-out-material
      {
        path: 'due-out-material-order',
        loadChildren: 'app/features/system/due-out-material/due-out-material.module#DueOutMaterialModule',
        data: { pageTitle: 'Due Out Material' },
        canActivate: [AuthGuard],
      },
      // inbount-style
      {
        path: 'inbount-style',
        loadChildren: 'app/features/system/inbount-style/inbount-style.module#InbountStyleModule',
        data: { pageTitle: 'Inbount Style' },
        canActivate: [AuthGuard],
      },
       // sales-due-out
       {
        path: 'sales-due-out',
        loadChildren: 'app/features/system/sales-due-out/sales-due-out.module#SalesDueOutModule',
        data: { pageTitle: 'Sales Due Out' },
        canActivate: [AuthGuard],
      },
    ]
  },

  {
    path: "auth",
    component: AuthLayoutComponent,
    loadChildren: "app/features/auth/auth.module#AuthModule"
  },



  { path: "**", redirectTo: "error/error404" }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  // imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

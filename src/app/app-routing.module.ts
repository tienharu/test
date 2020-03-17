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
        loadChildren: () => import('@app/features/home/home.module').then(m => m.HomeModule),
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
        loadChildren: () => import('@app/features/error/error.module').then(m => m.ErrorModule),
        data: { pageTitle: "Error" }
      },
      // home.
      // {
      //   path: 'home',
      //   loadChildren: '@app/features/home/home.module#HomeModule',
      //   data: { pageTitle: 'Home' },
      //   canActivate: [AuthGuard],
      // },

      // dashboard.
      {
        path: "dashboard",
        loadChildren: () => import('@app/features/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { pageTitle: "Dashboard" }
      },

      // register-system-menu.
      {
        path: 'register-system-menu',
        loadChildren: () => import('@app/features/system/system-menu/system-menu.module').then(m => m.SystemMenuModule),
        data: { pageTitle: 'Register System menu' },
        canActivate: [AuthGuard],
      },

      // register-company.
      {
        path: 'register-company',
        loadChildren: () => import('@app/features/system/company-master/company-master.module').then(m => m.CompanyMasterModule),
        data: { pageTitle: 'Register Company' },
        canActivate: [AuthGuard],
      },
      //group sharing master
      {
        path: 'group-sharing-setting',
        loadChildren: () => import('@app/features/system/group-sharing-setting/group-sharing-setting.module').then(m => m.GroupSharingSettingModule),
        canActivate: [AuthGuard],
      },
      //security item setting
      {
        path: 'security-item-setting',
        loadChildren: () => import('@app/features/system/security-item-setting/security-item-setting.module').then(m => m.SecurityItemSettingModule),
        canActivate: [AuthGuard],
      },
      // register-organization.
      {
        path: 'register-organization',
        loadChildren: () => import('@app/features/system/organization-master/organization-master.module').then(m => m.OrganizationMasterModule),
        data: { pageTitle: 'Register Organization' },
        canActivate: [AuthGuard],
      },

      // register-position.
      {
        path: 'register-position',
        loadChildren: () => import('@app/features/system/position-master/position-master.module').then(m => m.PositionMasterModule),
        data: { pageTitle: 'Register Position' },
        canActivate: [AuthGuard],
      },

      // register-user.
      {
        path: 'register-user',
        loadChildren: () => import('@app/features/system/user-master/user-master.module').then(m => m.UserMasterModule),
        data: { pageTitle: 'Register User' },
        canActivate: [AuthGuard],
      },

      // register-authority-group.
      {
        path: 'register-authority-group',
        loadChildren: () => import('@app/features/system/register-authority-group/register-authority-group.module').then(m => m.RegisterAuthorityGroupModule),
        data: { pageTitle: 'Register Authority Group' },
        canActivate: [AuthGuard],
      },

      // authority-group-menu-setting.
      {
        path: 'authority-group-menu-setting',
        loadChildren: () => import('@app/features/system/authority-group-menu-setting/authority-group-menu-setting.module').then(m => m.AuthorityGroupMenuSettingModule),
        data: { pageTitle: 'Authority Group Menu Setting' },
        canActivate: [AuthGuard],
      },

      // user-authority-group-setting.
      {
        path: 'user-authority-group-setting',
        loadChildren: () => import('@app/features/system/user-authority-group-setting/user-authority-group-setting.module').then(m => m.UserAuthorityGroupSettingModule),
        data: { pageTitle: 'User Authority Group Setting' },
        canActivate: [AuthGuard],
      },

      // general-master.
      {
        path: 'general-master',
        loadChildren: () => import('@app/features/system/general-master/general-master.module').then(m => m.GeneralMasterModule),
        data: { pageTitle: 'General Master' },
        canActivate: [AuthGuard],
      },

      // language-setting.
      {
        path: 'language-setting',
        loadChildren: () => import('@app/features/system/language-master/language-master.module').then(m => m.LanguageMasterModule),
        data: { pageTitle: 'Language Setting' },
        canActivate: [AuthGuard],
      },

      // geneal-sys-master
      {
        path: 'general-sys-master',
        loadChildren: () => import('@app/features/system/general-sys-master/general-sys-master.module').then(m => m.GeneralSysMasterModule),
        data: { pageTitle: 'General Sys Master' },
        canActivate: [AuthGuard],
      },
      // account master
      {
        path: 'account-master',
        loadChildren: () => import('@app/features/system/account-master/main-info/main-info.module').then(m => m.MainInfoModule),
        data: { pageTitle: 'Account Master' },
        canActivate: [AuthGuard],
      },
      //transaction code box
      {
        path: 'transaction-code',
        loadChildren: () => import('@app/features/system/transaction-code-box/transaction-code-box.module').then(m => m.TransactionCodeBoxModule),
        data: { pageTitle: 'Transaction-code Box' },
        canActivate: [AuthGuard],
      },
      //packages
      {
        path: 'package-master',
        loadChildren: () => import('@app/features/system/package-master/package-master.module').then(m => m.PackageMasterModule),
        data: { pageTitle: 'Packages Master' },
        canActivate: [AuthGuard],
      },
      {
        path: 'package-menu',
        loadChildren: () => import('@app/features/system/package-menu/package-menu.module').then(m => m.PackageMenuModule),
        data: { pageTitle: 'Packages Menu' },
        canActivate: [AuthGuard],
      },
      // routing-master
      {
        path: 'routing-master',
        loadChildren: () => import('@app/features/system/routing-master/routing-master.module').then(m => m.RoutingMasterModule),
        data: { pageTitle: 'Routing Master' },
        canActivate: [AuthGuard],
      },
      // material-master
      {
        path: 'material-master',
        loadChildren: () => import('@app/features/system/material-master/material-master.module').then(m => m.MaterialMasterModule),
        data: { pageTitle: 'Material Master' },
        canActivate: [AuthGuard],
      },
      // wip-master
      {
        path: 'wip-master',
        loadChildren: () => import('@app/features/system/wip-master/wip-master.module').then(m => m.WipMasterModule),
        data: { pageTitle: 'Wip Master' },
        canActivate: [AuthGuard],
      },
      // product-master
      {
        path: 'product-master',
        loadChildren: () => import('@app/features/system/product-master/product-master.module').then(m => m.ProductMasterModule),
        data: { pageTitle: 'Product Master' },
        canActivate: [AuthGuard],
      },
      // global-master
      {
        path: 'global-master',
        loadChildren: () => import('@app/features/system/global-master/global-master.module').then(m => m.GlobalMasterModule),
        data: { pageTitle: 'Global Master' },
        canActivate: [AuthGuard],
      },
      // bom-master
      {
        path: 'bom-master',
        loadChildren: () => import('@app/features/system/bom-master/bom-master.module').then(m => m.BomMasterModule),
        data: { pageTitle: 'BOM Master' },
        canActivate: [AuthGuard],
      },
      // cus-master
      {
        path: 'customer-new-master',
        loadChildren: () => import('@app/features/system/customer-new-master/customer-new-master.module').then(m => m.CustomerNewMasterModule),
        data: { pageTitle: 'Customer Master' },
        canActivate: [AuthGuard],
      },
      // sales-order-create
      {
        path: 'sales-order-create',
        loadChildren: () => import('@app/features/order/sales-order-create/sales-order-create.module').then(m => m.SalesOrderCreateModule),
        data: { pageTitle: 'Sales Order Create' },
        canActivate: [AuthGuard],
      },
      // sales-order-board
      {
        path: 'sales-order-board',
        loadChildren: () => import('@app/features/order/sales-order-board/sales-order-board.module').then(m => m.SalesOrderBoardModule),
        data: { pageTitle: 'Sales Order Board' },
        canActivate: [AuthGuard],
      },
      // process-flow-master
      {
        path: 'process-flow-master',
        loadChildren: () => import('@app/features/system/process-flow-master/process-flow-master.module').then(m => m.ProcessFlowMasterModule),
        data: { pageTitle: 'Process Flow Master' },
        canActivate: [AuthGuard],
      },
      // item-master
      {
        path: 'item-master',
        loadChildren: () => import('@app/features/system/item-master/item-master.module').then(m => m.ItemMasterModule),
        data: { pageTitle: 'Item Master' },
        canActivate: [AuthGuard],
      },
      // rocket-chat
      {
        path: 'rocket-chat',
        loadChildren: () => import('@app/features/system/rocket-chat/rocket-chat.module').then(m => m.RocketChatModule),
        data: { pageTitle: 'Rocket Chat' },
        canActivate: [AuthGuard],
      },
      // Approval Master
      {
        path: 'approval-line-registration',
        loadChildren: () => import('@app/features/system/approval-line-registration/approval-line-registration.module').then(m => m.ApprovalLineRegistrationModule),
        data: { pageTitle: 'Approval Line Registration' },
        canActivate: [AuthGuard],
      },
      // human-resource.
      {
        path: 'employee-master',
        loadChildren: () => import('@app/features/human-resources/employee-info/main-info/main-info.module').then(m => m.HRMainInfoModule),
        data: { pageTitle: 'Human Resources' },
        canActivate: [AuthGuard],
      },
      {
        path: 'employee-print',
        loadChildren: () => import('@app/features/human-resources/employee-print/employee-print.module').then(m => m.HREmployeePrintModule),
        data: { pageTitle: 'Human Resources' },
        canActivate: [AuthGuard],
      },
      {
        path: 'employee-print-card',
        loadChildren: () => import('@app/features/human-resources/employee-print-card/employee-print-card.module').then(m => m.EmployeePrintCardModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'trader-master',
        loadChildren: () => import('@app/features/master/trader-master/trader-master.module').then(m => m.TraderMasterModule),
        canActivate: [AuthGuard],
      },
      // crm
      {
        path: 'customer-master',
        loadChildren: () => import('@app/features/crm/customer/customer-master/customer-master.module').then(m => m.CustomerMasterModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'customer-detail/:id',
        loadChildren: () => import('@app/features/crm/customer/customer-detail/customer-detail.module').then(m => m.CustomerDetailModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'contactor-detail/:id',
        loadChildren: () => import('@app/features/crm/contactor/contactor-detail/contactor-detail.module').then(m => m.ContactorDetailModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'crm-contactor',
        loadChildren: () => import('@app/features/crm/contactor/contactor-master/contactor-master.module').then(m => m.ContactorMasterModule),
        canActivate: [AuthGuard],
      },

      {
        path: 'crm-payment',
        loadChildren: () => import('@app/features/crm/order-magt/expenses-magt/expenses-magt.module').then(m => m.ExpensesMagtModule),
        canActivate: [AuthGuard],
      },

      {
        path: 'crm-service-item',
        loadChildren: () => import('@app/features/crm/setting/service-item/service-item.module').then(m => m.ServiceItemModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'overtime-table',
        loadChildren: () => import('@app/features/human-resources/overtime-table/overtime-table.module').then(m => m.HrOvertimeTableModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'work-calendar',
        loadChildren: () => import('@app/features/human-resources/work-calendar/work-calendar.module').then(m => m.WorkCalendarModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'annual-leave-register',
        loadChildren: () => import('@app/features/human-resources/annual-leave/annual-leave.module').then(m => m.AnnualLeaveModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'posting-attendance-list',
        loadChildren: () => import('@app/features/human-resources/annual-leave/posting-attendance-list/posting-attendance-list.module').then(m => m.PostingAttendanceListModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'ETL-Machine',
        loadChildren: () => import('@app/features/human-resources/attendance-machine/attendance-machine.module').then(m => m.MasMachineDataModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'shiftwork-register',
        loadChildren: () => import('@app/features/human-resources/shiftwork-register/shiftwork-register.module').then(m => m.ShiftworkRegisterModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'salary-basic',
        loadChildren: () => import('@app/features/human-resources/standard-salary-basic/salary-register.module').then(m => m.SalaryRegisterModule),
        canActivate: [AuthGuard],
      },
      //payroll
      {
        path: 'special-payment',
        loadChildren: () => import('@app/features/human-resources/special-salary/special-salary.module').then(m => m.HrSpecialSalaryModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'payroll-item',
        loadChildren: () => import('@app/features/human-resources/payroll-item/payroll-item.module').then(m => m.PayrollItemModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'payroll-master',
        loadChildren: () => import('@app/features/human-resources/payroll-master/payroll-master.module').then(m => m.PayrollMasterModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'news-master',
        loadChildren: () => import('@app/features/system/news-master/news-master.module').then(m => m.NewsMasterModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'daily-duty-adjust',
        loadChildren: () => import('@app/features/human-resources/daily-attendance/daily-attendance.module').then(m => m.DailyAttendanceModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'personal-duty-adjust',
        loadChildren: () => import('@app/features/human-resources/attendance-person/attendance-person.module').then(m => m.AttendancePersonModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'duty-type',
        loadChildren: () => import('@app/features/human-resources/duty-type/duty-type.module').then(m => m.DutyTypeModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'report-monthly-overtime',
        loadChildren: () => import('@app/features/human-resources/monthly-overtime-report/monthly-overtime-report.module').then(m => m.MonthlyOvertimeReportModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'report-monthly-duty',
        loadChildren: () => import('@app/features/human-resources/monthly-duty-report/monthly-duty-report.module').then(m => m.MonthlyDutyReportModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'report-monthly-attendance',
        loadChildren: () => import('@app/features/human-resources/monthly-attendance-report/monthly-attendance-report.module').then(m => m.MonthlyAttendanceReportModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'report-daily-duty',
        loadChildren: () => import('@app/features/human-resources/daily-duty-report/daily-duty-report.module').then(m => m.DailyDutyReportModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'report-daily-duty-department',
        loadChildren: () => import('@app/features/human-resources/daily-duty-dept-report/daily-duty-dept-report.module').then(m => m.DailyDutyByDeptReportModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'gvn-monthly-attendance',
        loadChildren: () => import('@app/features/human-resources/report/green-vina/gvn-monthly-attendance/gvn-monthly-attendance.module').then(m => m.GvnMonthlyAttendanceModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'gvn-summary-excel',
        loadChildren: () => import('@app/features/human-resources/report/green-vina/summary-excel-download/summary-excel.module').then(m => m.GvnReportSummaryExcelModule),
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'report-monthly-overtime-adidas', 
      //   loadChildren: '@app/features/human-resources/report/adidas/monthly-overtime/adidas-monthly-overtime.module#AdidasMonthlyOvertimeModule', 
      //   canActivate: [AuthGuard],
      // },
      // {
      //   path: 'report-monthy-turnover-rate-adidas', 
      //   loadChildren: '@app/features/human-resources/report/adidas/monthly-turnover/adidas-monthly-turnover.module#AdidasMonthlyTurnoverModule', 
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'crm-sales-opportunity',
        loadChildren: () => import('@app/features/crm/opportunity/opportunity-master/opportunity-master.module').then(m => m.OpportunityMasterModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'opportunity-detail/:id',
        loadChildren: () => import('@app/features/crm/opportunity/opportunity-detail/opportunity-detail.module').then(m => m.OpportunityDetailModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'closing-payroll',
        loadChildren: () => import('@app/features/human-resources/payroll-closing/payroll-closing.module').then(m => m.PayrollClosingModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'crm-project',
        loadChildren: () => import('@app/features/crm/project/project-master/project-master.module').then(m => m.ProjectMasterModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'project-detail/:id',
        loadChildren: () => import('@app/features/crm/project/project-detail/project-detail.module').then(m => m.ProjectDetailModule),
        canActivate: [AuthGuard],
      },
      // style-master
      {
        path: 'style-master',
        loadChildren: () => import('@app/features/system/style-master/style-master.module').then(m => m.StyleMasterModule),
        data: { pageTitle: 'Style Master' },
        canActivate: [AuthGuard],
      },
      // bank-book
      {
        path: 'bank-book',
        loadChildren: () => import('@app/features/system/bank-book/bank-book.module').then(m => m.BankBookModule),
        data: { pageTitle: 'Bank Book' },
        canActivate: [AuthGuard],
      },
      // work-order-master
      {
        path: 'work-order-master',
        loadChildren: () => import('@app/features/system/work-order-master/work-order-master.module').then(m => m.WorkOrderMasterModule),
        data: { pageTitle: 'Work Order Master' },
        canActivate: [AuthGuard],
      },
      // po-sheet
      {
        path: 'po-sheet',
        loadChildren: () => import('@app/features/system/po-sheet/po-sheet.module').then(m => m.PoSheetModule),
        data: { pageTitle: 'PO Sheet' },
        canActivate: [AuthGuard],
      },
      // purch-order
      {
        path: 'purch-order',
        loadChildren: () => import('@app/features/system/purch-order/purch-order.module').then(m => m.PurchOrderModule),
        data: { pageTitle: 'Purch Order' },
        canActivate: [AuthGuard],
      },
      //purchasing
      {
        path: 'purchasing',
        loadChildren: () => import('@app/features/system/purchasing-magt/purchasing-magt.module').then(m => m.PurchasingModule),
        data: { pageTitle: 'Purchasing' },
        canActivate: [AuthGuard],
      },
      //due-out-material
      {
        path: 'due-out-material-order',
        loadChildren: () => import('@app/features/system/due-out-material/due-out-material.module').then(m => m.DueOutMaterialModule),
        data: { pageTitle: 'Due Out Material' },
        canActivate: [AuthGuard],
      },
      // inbount-style
      {
        path: 'inbount-style',
        loadChildren: () => import('@app/features/system/inbount-style/inbount-style.module').then(m => m.InbountStyleModule),
        data: { pageTitle: 'Inbount Style' },
        canActivate: [AuthGuard],
      },
       // sales-due-out
       {
        path: 'sales-due-out',
        loadChildren: () => import('@app/features/system/sales-due-out/sales-due-out.module').then(m => m.SalesDueOutModule),
        data: { pageTitle: 'Sales Due Out' },
        canActivate: [AuthGuard],
      },
    ]
  },

  {
    path: "auth",
    component: AuthLayoutComponent,
    loadChildren: () => import('@app/features/auth/auth.module').then(m => m.AuthModule)
  },



  { path: "**", redirectTo: "error/error404" }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  // imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

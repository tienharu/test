import { Component, OnInit } from '@angular/core';
import { HrSpecialSalaryDetailModel } from '@app/core/models/hr/hr-special-salary-detail.model';
import { HrSpecialSalaryDetailService } from '@app/core/services/hr.services/hr-special-salary-detail-service';
import { NotificationService, AuthService, OrganizationMasterService } from '@app/core/services';
import { HrMainInfoService } from '@app/core/services/hr.services/hr-main-info.service';
import { HrSpecialSalaryModel } from '@app/core/models/hr/hr-special-salary.model';
import { BasePage } from '@app/core/common/base-page';
import { CommonFunction } from '@app/core/common/common-function';
import { CustomRenderSmartTableSelectComponent, CustomRenderSmartTableSelectzComponent } from '../overtime-table/smart-table-select.component';
import { ProgramList } from '@app/core/common/static.enum';
import { I18nService } from '@app/shared/i18n/i18n.service';

@Component({
  selector: 'sa-special-salary-detail',
  templateUrl: './special-salary-detail.component.html',
  styleUrls: ['../../../../assets/css/smart-table.scss',"../overtime-table/overtime-table.component.css"],
  entryComponents: [CustomRenderSmartTableSelectComponent,CustomRenderSmartTableSelectzComponent]
})
export class HrSpecialSalaryDetailComponent extends BasePage implements OnInit {
  
  spSalaryDetail:any[] = [];
  hrlist: any[] = [];
  departments: any[] = [];
  settings:any;
  userLogin: any;
  specialSalary :HrSpecialSalaryModel;
  constructor(
    private notification: NotificationService,
    private hrSpecialSalaryDetailService: HrSpecialSalaryDetailService,
    private hrMainInfoService : HrMainInfoService,
    public userService: AuthService,
    public organizationMasterService: OrganizationMasterService,
    private i18nService:I18nService
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Special_Payment_Item.valueOf());
    this.organizationMasterService.listOrganization(this.companyInfo.company_id).then(d => {
        d.forEach(element => {
          this.departments.push({
            value: element.org_nm_eng,
            title: element.org_nm_eng
          });
        });
        this.initTable(this.hrlist,this.departments);
      });
    this.userLogin = this.userService.getUserInfo();
    this.getHRList(this.userLogin.company_id);
  }

  initTable(hrlist, departments){
    this.settings = {
      actions: {
        position: 'left'
      },
      delete: {
        confirmDelete: true,
        deleteButtonContent: '<i class="fa fa-times"></i>',
      },
      add: {
        confirmCreate: true,
        createButtonContent: '<i class="fa fa-save" ></i>',
        cancelButtonContent: '<i class="fa fa-ban"></i>',
      },
      edit: {
        confirmSave: true,
        editButtonContent: '<i class="fa fa-edit"></i>',
        saveButtonContent: '<i class="fa fa-save" ></i>',
        cancelButtonContent: '<i class="fa fa-ban"></i>',
      },
      columns: {
        department: {
          title: this.i18nService.getTranslation('Department'),
          type: 'string',
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: departments,
            },
          },
          filterFunction(cell, search) {
            return cell.toLowerCase().includes(search.toString().toLowerCase());
          },
          editable: false,
          addable: false,
        },
        hr_id_display: {
          title: this.i18nService.getTranslation('HR-ID'),
          type: 'string',
          editable: false,
          addable: false,
        },
        hr_id: {
          title:  this.i18nService.getTranslation('EMPLOYEE'),
          type: 'string',
          width: '200px',
          editable: false,
          filter: {
            type: 'list',
            config: {
              selectText: 'All',
              list: hrlist,
            },
          },
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: hrlist,
            },
          },
          valuePrepareFunction: (cell, row) => {return row.employee_nm}
        },
        start_work_ymd: {
          title: this.i18nService.getTranslation('START-WORK'),
          type: 'string',
          editable: false,
          addable: false,
          valuePrepareFunction:(cell,row) => {return cell?new Date(cell).toString('yyyy-MM-dd'):cell}
        },
        amount: {
          title: this.i18nService.getTranslation('SPEC-SALARY-AMOUNT'),
          type: 'string',
          defaultValue: '0',
          valuePrepareFunction:(cell,row) => {return CommonFunction.FormatMoney(cell)}
        },
        remark: {
          title: this.i18nService.getTranslation('Remark'),
          type: 'string',
          width: '300px'
        },
      },
      pager:{
        display: true,
        perPage: 10
      },
      attr: {
        class: 'table table-bordered'
      }
    };
  }

  pushEmployeeName(){
    for (let i = 0; i < this.spSalaryDetail.length; i++) {
      for (let j = 0; j < this.hrlist.length; j++) {
        if (this.spSalaryDetail[i].hr_id == this.hrlist[j].value) {
          this.spSalaryDetail[i].hr_id_display = this.hrlist[j].value;
          this.spSalaryDetail[i].employee_nm = this.hrlist[j].title;
      }
    }}
    this.initTable(this.hrlist,this.departments)
  }

  getDataFromMain(specialSalary,isReset) {
    this.spSalaryDetail = [];
    if (!isReset) {
      this.specialSalary = specialSalary;
      
      this.hrSpecialSalaryDetailService.listHrSpecialSalaryDetail(specialSalary.company_id, specialSalary.orgid,specialSalary.year,specialSalary.month,specialSalary.special_pay_item_id)
          .then(data => {
            this.spSalaryDetail = data.data;
            this.pushEmployeeName();
          })
    } 
}

getHRList(companyId){
    this.hrMainInfoService.listHrMainInfo(companyId).then(data => {
      for (let i = 0; i < data.data.length; i++) {
        this.hrlist.push({ value: data.data[i].hr_id, title: data.data[i].employee_nm });   
       }
       this.initTable(this.hrlist,this.departments)
  })
}

onCreateConfirm(event) {
  let _obj = event.newData;
 _obj.company_id = this.specialSalary.company_id;
 _obj.year = this.specialSalary.year;
 _obj.month = this.specialSalary.month;
 _obj.special_pay_item_id = this.specialSalary.special_pay_item_id;
 this.hrSpecialSalaryDetailService.insertHrSpecialSalaryDetail(_obj).then(data => {
   if (data.error) {
     this.notification.showMessage("error", data.error.message);
   } else {
      this.getDataFromMain(this.specialSalary,false);
      this.notification.showMessage("success", data.message);
   }
 })
 console.log("event",event)
}

onSaveConfirm(event) {
  if(!this.permission.canSave){
    this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_CREATE_PERMISSION_DENIED'));
    return;
  }
 let _obj = event.newData;
 _obj.type="update";
 this.hrSpecialSalaryDetailService.insertHrSpecialSalaryDetail(_obj).then(data => {
   if (data.error) {
     this.notification.showMessage("error", data.error.message);
   } else {
     event.confirm.resolve(event.newData);
     setTimeout(() => {
      this.pushEmployeeName();
     }, 100);
     this.notification.showMessage("success", data.message);
   }
 })
}

onDeleteConfirm(event){
 let _obj = event.data;
 if(!this.permission.canDelete){
  this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
  return;
}
 this.notification.confirmDialog(
   "Delete Special Payment Confirmation!",
   `Are you sure to delete this record?`,
   x => {
     if (x) {
       this.hrSpecialSalaryDetailService.DeleteHrSpecialSalaryDetail(_obj).then(data => {
         if (data.error) {
           event.confirm.reject();
           this.notification.showMessage("error", data.error.message);
         } else {
           event.confirm.resolve(event.data);
           setTimeout(() => {
             this.spSalaryDetail = event.source.data;
             this.pushEmployeeName();
           }, 100);
           this.notification.showMessage("success",data.message);
         }
       })
     }
   }
 );
}
}

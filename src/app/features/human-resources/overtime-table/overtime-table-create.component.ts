import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { HrMasOvertimeTableModel, HrOvertimeTableDetailModel } from '@app/core/models/hr/hr-overtime-table.model';
import { NotificationService } from '@app/core/services/notification.service';
import { HrOvertimeTableService } from '@app/core/services/hr.services/hr-overtime-table.service';
import { AuthService } from '@app/core/services/auth.service';
import { BasePage } from '@app/core/common/base-page';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { CRMSolutionApiService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category } from '@app/core/common/static.enum';


@Component({
    selector: 'sa-overtime-table-create',
    templateUrl: './overtime-table-create.component.html',
  })

  export class OvertimeTableCreateComponent extends BasePage implements OnInit {
    workDayTypes: any[] = [];
    overtimeTableInfo: HrMasOvertimeTableModel;
    @Input() overtimeTableInfoJson: any;
    overTimeTableMax : any;
    isOTTableExisted = false;
    isLoading = false;
    isUpdate = false;
    @Input() maxOverTableId : number = 0;
    @Output() onCreatedNew = new EventEmitter<any>();
    ngOnInit() {
      if(this.overtimeTableInfoJson && this.overtimeTableInfoJson!=''){
        this.overtimeTableInfo=JSON.parse(this.overtimeTableInfoJson);
        if(this.overtimeTableInfo.work_day_type_gen_cd && this.overtimeTableInfo.work_day_type_gen_cd!=''){
          this.isUpdate=true
        }
        else{
          this.isUpdate=false
        }
      }
        else{
          this.overtimeTableInfo = new HrMasOvertimeTableModel;
        this.overtimeTableInfo.company_id = this.companyInfo.company_id;
        this.overtimeTableInfo.interval_minute=30;
        this.overtimeTableInfo.buffer_minute=5;
        this.overtimeTableInfo.ot_table_id=this.maxOverTableId+1
        }

        this.getDayType().then(data => {
          this.workDayTypes.push(...data)
        });
    }

    constructor(
        private api: CRMSolutionApiService,
        private notification: NotificationService,
        private hrOvertimeTableService: HrOvertimeTableService,
        private generalMasterService: GeneralMasterService,
        public userService: AuthService
    ) {
        super(userService);
    }
    getDayType() {
      return this.generalMasterService.listGeneralByCate(Category.WorkDayType.valueOf())
    }
    public validationOptions: any = {
        ignore: [], //enable hidden validate
        // Rules for form validation
        rules: {
          ot_table_id: {
            required: true
          }
        },
        // Messages for form validation
        messages: {
          ot_table_id: {
            required: "*"
          },
        }
      };

    insertOvertimeTable() {
      this.isLoading=true;
        this.hrOvertimeTableService.InsertOvertimeTable(this.overtimeTableInfo).then(data => {
          //console.log("data",data)
          this.isLoading=false;
          if (data.error) {
            this.notification.showMessage("error", data.error.message);
          } else {
            if (data.existed) {
              this.notification.confirmDialog('Override Confirmation', data.message, (x) => {
                if (x) {
                  //resend with confirm=true
                  this.isLoading=true;
                  this.hrOvertimeTableService.InsertOvertimeTable(this.overtimeTableInfo, true).then(data => {
                    this.isLoading=false;
                    if (data.error) {
                      this.notification.showMessage("error", data.error.message);
                    } else {
                      this.notification.showMessage("success", data.message);
                        if(this.onCreatedNew){
                          console.log('from pp',this.overtimeTableInfo)
                          this.onCreatedNew.emit(this.overtimeTableInfo);
                        }
                    }
                  });
                }
              });
            }
            else{
              this.notification.showMessage("success", data.message);
              if(this.onCreatedNew){
                this.onCreatedNew.emit(this.overtimeTableInfo);
              }
            }
          }
        });
      }
  }
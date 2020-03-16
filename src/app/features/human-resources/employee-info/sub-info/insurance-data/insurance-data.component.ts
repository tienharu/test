import { Component, OnInit, Input, } from '@angular/core';
import { NotificationService } from '@app/core/services/notification.service';
import { HrInsuranceInfoService } from '@app/core/services/hr.services/hr-insurance-info.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { HrInsuranceInfoModel } from '@app/core/models/hr/hr-insurance-info.model';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { AuthService } from '@app/core/services';
import { BasePage } from '@app/core/common/base-page';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';


@Component({
  selector: 'sa-insurance-data',
  templateUrl: './insurance-data.component.html',
  styleUrls: ['../../main-info/main-info2.component.css']
})
export class InsuranceDataComponent extends BasePage implements OnInit {
  insuranceInfo: HrInsuranceInfoModel;
  insurance: any[] = [];
  options: any;
  // @Input() companyId: number;
  // @Input() hrId: string;
  companyId: number;
  hrId: string;
  constructor(
    private notification: NotificationService,
    private hrInsuranceInfoService: HrInsuranceInfoService,
    private generalMasterService: GeneralMasterService,
    public userService: AuthService,
    private i18nService:I18nService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    super(userService);
    this.insuranceInfo = this.hrInsuranceInfoService.getModel();
  }
  resetData(){

  }
  ngOnInit() {
    this.checkPermission(ProgramList.Personal_Info_Master.valueOf());
    this.insuranceInfo.hr_id = this.hrId;
    this.insuranceInfo.company_id = this.companyId;
    this.initDatatable();
    this.getInsurance().then(data => {
      this.insurance.push(...data)
    })
  }

  getDataFromMain(companyID: number, hrID: string) {
    this.hrInsuranceInfoService.resetModel();
    this.insuranceInfo = this.hrInsuranceInfoService.getModel();
    this.companyId = companyID;
    this.hrId = hrID;
    this.insuranceInfo.company_id = companyID;
    this.insuranceInfo.hr_id = hrID;
    this.reloadDatatable();
  }
  getInsurance() {
    return this.generalMasterService.listGeneralByCate(Category.InsuranceType.valueOf())
  }
  
  //validate
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      insurance_gen_cd: {
        required: true
      },
      insurance_rate: {
        required: true
      },
      insurance_money: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      insurance_gen_cd: {
        required: "Please enter"
      },
      insurance_rate: {
        required: "Please enter "
      },
      insurance_money: {
        required: "Please enter "
      }
    }
  };

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrInsuranceInfoService.listInsurance(this.companyId, this.hrId).then(data => {
          callback({
            aaData: data
          });
          console.log(data)
        })
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            var o = this.insurance.filter(x => x.gen_cd == data.insurance_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        },
        { data: "insurance_no", className: "", width: "100px" },
        { data: "insurance_rate", className: "right", width: "100px" },
        { data: "insurance_money", className: "right", width: "100px" },
        {
          data: (data, type, dataToSet) => {            
            if (data.apply_yn == true) return 'Yes';
            else return "No";
          }
          , className: "center", width: "100px" 

        },
        { data: "apply_ymd", className: "center", width: "100px" },
      ],
      scrollY: 210,
      scrollX: true,
      paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.insuranceInfo = new HrInsuranceInfoModel();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-trash text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if(!this.permission.canDelete){
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.period;
              this.notification.confirmDialog(
                "Delete Insurance Data Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrInsuranceInfoService.DeleteHrInsuranceInfo(this.insuranceInfo).then(data => {
                      if (data.error) {
                        this.notification.showMessage("error", data.error.message);
                      } else {
                        this.notification.showMessage(
                          "success",
                          data.message
                        );
                        this.reloadDatatable();
                      }
                    })
                  }
                }
              );
            }
          }
        },
        "copy",
        "excel",
        "pdf",
        "print"
      ]
    };
  }

  onRowClick(event) {
    setTimeout(() => {
      this.insuranceInfo = event;
    }, 100);
    var f = $("form.frmInsurance").validate();
    if (!f.valid()) {
      f.resetForm();
    }
  }

  onSubmit() {
    this.hrInsuranceInfoService.insertHrInsuranceInfo(this.insuranceInfo).then(data => {
      if (data.error) {
        if (data.error.code === 403) {
          this.modalService.hide(1);
          this.router.navigate(["/error/error403"]);
        }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.reloadDatatable();
      }
    })
  }

  onReset() {
    $("form.frmInsurance")
      .validate()
      .resetForm();
    this.hrInsuranceInfoService.resetModel();
    this.insuranceInfo = this.hrInsuranceInfoService.getModel();
    this.insuranceInfo.company_id = this.companyId;
    this.insuranceInfo.hr_id = this.hrId;
    this.reloadDatatable();
  }

  private reloadDatatable() {
    $(".eplInsuranceInfoList")
      .DataTable()
      .ajax.reload();
  }
}

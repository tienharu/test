import { Component, OnInit, Input } from '@angular/core';
import { HrContractInfoModel } from '@app/core/models/hr/hr-contract-info.model';
import { NotificationService } from '@app/core/services/notification.service';
import { HrContractInfoService } from '@app/core/services/hr.services/hr-contract-info.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { AuthService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BasePage } from '@app/core/common/base-page';
import { ProgramList } from '@app/core/common/static.enum';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'sa-contract-data',
  templateUrl: './contract-data.component.html',
  styleUrls: ['../../main-info/main-info2.component.css']
})
export class ContractDataComponent extends BasePage implements OnInit {
  contractInfo: HrContractInfoModel;
  options: any;
  myFiles:string [] = [];
  @Input() companyId: number;
  @Input() hrId: string;
  constructor(
    private notification: NotificationService,
    private hrContractInfoService: HrContractInfoService,
    private generalMasterService: GeneralMasterService,
    public userService: AuthService,
    private i18nService:I18nService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Personal_Info_Master.valueOf());
    this.contractInfo = this.hrContractInfoService.getModel();
    this.initDatatable();
    this.contractInfo.company_id = this.companyId;
    this.contractInfo.hr_id = this.hrId;
    $("#contract_no").spinner({
      step: 1,
      min: 1
  });
 
  }
//validate
    public validationOptions: any = {
      ignore: [], //enable hidden validate
      // Rules for form validation
      rules: {
        from_ymd: {
          required: true
        },
        contract_no:{ required: true}
      },
      // Messages for form validation
      messages: {
        from_ymd: {
          required: "Please enter"
        },
        contract_no:{
          required: "Please enter"
        }
      }
    };
    //
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrContractInfoService.listContract(this.companyId, this.hrId).then(data => {
          callback({
            aaData: data
          });
        })
      },
      columns: [
        { data: "contract_no", className: "center", width: "50px" },
        { data: "contract_number", className: "center", width: "80px" },
        { data: "from_ymd", className: "center", width: "100px" },
        { data: (data) =>{
          if (data.unlimitted==true) {
            data.to_ymd='';
            return "Unlimitted";
          }else return data.to_ymd;
        }, className: "center", width: "100px" },
        { data: "remark", className: "", width: "auto" }
      ],
      scrollY: 100,
      scrollX: true,
      paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            this.onReset();
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
              var selectedText: string = rowSelected.contract_no;
              this.notification.confirmDialog(
                "Delete Contract condition Confirmation!",
                `Are you sure to delete contract no ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrContractInfoService.DeleteHrContract(this.contractInfo).then(data => {
                      if (data.error) {
                        this.notification.showMessage("error", data.error.message);
                      } else {
                        this.notification.showMessage(
                          "success",
                          data.message
                        );
                        this.onReset();
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
  //
  onRowClick(event) {
    setTimeout(() => {
      this.contractInfo = event;
    }, 100);
    var f = $("form.frmContract").validate();
    if (!f.valid()) {
      f.resetForm();
    }

  }
  //
  onSubmit() {
    this.contractInfo.contract_no = $( "#contract_no").spinner( "value");
    this.hrContractInfoService.insertHrContract(this.contractInfo).then(data => {
      if (data.error) {
        if (data.error.code === 403) {
          this.modalService.hide(1);
          this.router.navigate(["/error/error403"]);
        }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.onReset()
      }
    })
  }

  onReset() {
    this.reloadDatatable();
    $("form.frmContract")
      .validate()
      .resetForm();
    this.hrContractInfoService.resetModel();
    this.contractInfo = this.hrContractInfoService.getModel();
    //
    this.contractInfo.company_id = this.companyId;
    this.contractInfo.hr_id = this.hrId;
  }

  private reloadDatatable() {
    $(".eplContractInfoList")
      .DataTable()
      .ajax.reload();
  }

  getFileDetails(e){
    for (var i = 0; i < e.target.files.length; i++) { 
      this.myFiles.push(e.target.files[i]);
    }
    console.log(this.myFiles);
  }
}

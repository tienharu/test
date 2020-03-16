import { Component, OnInit } from '@angular/core';
import { HrCetificateModel } from '@app/core/models/hr/hr-cetificate.model';
import { NotificationService } from '@app/core/services/notification.service';
import { HrCetificateService } from '@app/core/services/hr.services/hr-cetificate.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { AuthService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BasePage } from '@app/core/common/base-page';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'sa-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['../../../main-info/main-info2.component.css']
})
export class CertificateComponent extends BasePage implements OnInit {
  certificateInfo: HrCetificateModel;
  options : any;
  companyId: number = 0;
  hrId: string = '';
  certificate: any[] = [];
  certificateType : any[] =[];
  hrIdBK : string = '';
  constructor(
    private notification: NotificationService,
    private hrCetificateService: HrCetificateService,
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
    this.certificateInfo = this.hrCetificateService.getModel();
    this.initDatatable();
    $('.certi-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.certificateInfo.cetificated_ymd = selectedDate;
      }
    });
    $('.expire-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.certificateInfo.expire_ymd = selectedDate;
      }
    });
  }
  getCertificate() {
    return this.generalMasterService.listGeneralByCate(Category.Certificate.valueOf())
  }
  getCertificateType() {
    return this.generalMasterService.listGeneralByCate(Category.CertificateType.valueOf())
  }

  getDataFromCareer(companyID: number, hrID: string) {
    if (this.companyId === 0) {
      this.getCertificate().then(data => {
        this.certificate.push(...data);
      });
      this.getCertificateType().then(data => {
        this.certificateType.push(...data);
      });
      this.companyId = companyID;
      this.hrId = this.hrIdBK = hrID;
      this.onReset();
    }
    else{
      this.hrId = hrID;
    }

    if (this.hrIdBK !== hrID) {
      this.hrId = this.hrIdBK = hrID;
      this.onReset();
    }
  }
  resetChildCare(){
    this.hrCetificateService.resetModel();
    this.certificateInfo = this.hrCetificateService.getModel();
    $(".eplCertifiList").DataTable().clear().draw();
  }
  //
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrCetificateService.listCertificate(this.companyId, this.hrId).then(data => {
          callback({
            aaData: data
          });
        })
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            var c = this.certificate.filter(
              x => x.gen_cd === data.cetificated_gen_cd
            );
            if (c.length > 0) return c[0].gen_nm;
            else return "N/A";
          }
          ,width:"120px"
        },
        {
          data: (data, type, dataToSet) => {
            var c = this.certificateType.filter(
              x => x.gen_cd === data.cetificated_type_gen_cd
            );
            if (c.length > 0) return c[0].gen_nm;
            else return "N/A";
          }, className: "center",width:"100px"
        },
        { data: "cetificated_ymd", className: "center", width: "100px" },
        { data: "expire_ymd", className: "center", width: "100px" },
        { data: "cetificated_text", className: "", width: "100px" }
      ],
      //scrollY: 210,
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
              var selectedText: string = rowSelected.cetificated_gen_cd;
              this.notification.confirmDialog(
                "Delete Employee Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrCetificateService.DeleteHrCertificate(this.certificateInfo).then(data => {
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
      this.certificateInfo = event;
    }, 100);
    var f = $("form.frmCertificate").validate();
    if (!f.valid()) {
      f.resetForm();
    }

  }
  //
  onSubmit() {
    this.hrCetificateService.insertHrCertificate(this.certificateInfo).then(data => {
      if (data.error) {
        if (data.error.code === 403) {
          this.modalService.hide(1);
          this.router.navigate(["/error/error403"]);
        }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.onReset();
      }
    })
  }
  onReset() {
    this.reloadDatatable();
    $("form.frmCertificate")
      .validate()
      .resetForm();
    this.hrCetificateService.resetModel();
    this.certificateInfo = this.hrCetificateService.getModel();
    //
    this.certificateInfo.company_id = this.companyId;
    this.certificateInfo.hr_id = this.hrId;
  }

  private reloadDatatable() {
    $(".eplCertifiList")
      .DataTable()
      .ajax.reload();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { HrNewCareerModel } from '@app/core/models/hr/hr-new-career.model';
import { NotificationService } from '@app/core/services/notification.service';
import { HrNewCareerService } from '@app/core/services/hr.services/hr-new-career.service';
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { OrganizationMasterService, AuthService } from '@app/core/services';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { Form } from '@angular/forms';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BasePage } from '@app/core/common/base-page';
import { DutyTypeService } from '@app/core/services/hr.services/hr-mas-dutytype.service';

@Component({
  selector: 'sa-path-care',
  templateUrl: './path-care.component.html',
  styleUrls: ['./new-path-career/new-path-career.component.css']
})
export class PathCareComponent extends BasePage implements OnInit {
  @ViewChild("popupPathCareer") popupPathCareer;
  modalRef: BsModalRef;
  pathCareerInfo: HrNewCareerModel;
  options: any;
  companyId: number = 0;
  hrId: string = '';
  isAdd: boolean = true;

  Org: any[] = [];
  PathCareer: any[] = [];
  Salary: any[] = [];
  HRClass: any[] = [];
  DutyKind: any[] = [];
  DutyType: any[] = [];
  DutyStatus: any[] = [];
  WorkPlace: any[] = [];
  TaxCode: any[] = [];
  formData: any[] = [];
  hrIdBK : string = '';
  constructor(
    private notification: NotificationService,
    private hrNewCareerService: HrNewCareerService,
    private modalService: BsModalService,
    private generalMasterService: GeneralMasterService,
    private orgMasterService: OrganizationMasterService,
    private dutyTypeService: DutyTypeService,
    public userService: AuthService,
    private i18nService:I18nService
  ) {
    super(userService);
  }
 
  ngOnInit() {
    this.checkPermission(ProgramList.Personal_Info_Master.valueOf());
    this.pathCareerInfo = this.hrNewCareerService.getModel();
    this.initDatatable();
  }

  getDataFromCareer(companyID: number, hrID: string) {
    this.getOrg(companyID).then(data => {
      this.Org.push(...data)
    });
    if (this.companyId === 0) {
      this.getJobType().then(data => {
        this.Salary.push(...data)
      });
      this.getPathCareer().then(data => {
        this.PathCareer.push(...data)
      });
      this.getHRClass().then(data => {
        this.HRClass.push(...data)
      });
      this.getDutyKind().then(data => {
        this.DutyKind.push(...data)
      });
      this.getDutyType().then(data => {
        this.DutyType=data.data;
      });
      this.getDutyStatus().then(data => {
        this.DutyStatus.push(...data)
      });
      this.getWorkPlace().then(data => {
        this.WorkPlace.push(...data)
      });
      this.getTaxCode().then(data => {
        this.TaxCode.push(...data)
      });
      this.companyId = companyID;
      this.hrId = this.hrIdBK = hrID;
      this.reloadDatatable();
    }
    else{
      this.hrId = hrID;
    }

    if (this.hrIdBK !== hrID) {
      this.hrId = this.hrIdBK = hrID;
      this.reloadDatatable();
    }
    
    
  }
  resetChildCare() {
    $(".eplPathCareList").DataTable().clear().draw();
  }
  //

  getOrg(_companyID : number) {
    return this.orgMasterService.listOrganization(_companyID);
  }
  getPathCareer() {
    return this.generalMasterService.listGeneralByCate(Category.CareerPathType.valueOf())
  }
  getJobType() {
    return this.generalMasterService.listGeneralByCate(Category.HRJobType.valueOf())
  }
  getHRClass() {
    return this.generalMasterService.listGeneralByCate(Category.HRJobClass.valueOf())
  }
  getDutyKind() {
    return this.generalMasterService.listGeneralByCate(Category.DutyKind.valueOf())
  }
  getDutyType() {
    return this.dutyTypeService.getDutyTypes()
  }
  getDutyStatus() {
    return this.generalMasterService.listGeneralByCate(Category.DutyStatus.valueOf())
  }
  getWorkPlace() {
    return this.generalMasterService.listGeneralByCate(Category.WorkPlace.valueOf())
  }
  getTaxCode() {
    return this.generalMasterService.listGeneralByCate(Category.TaxCode.valueOf())
  }


  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrNewCareerService.listPathCare(this.companyId, this.hrId).then(data => {
          callback({
            aaData: data
          });
        })
      },
      columns: [
        { data: "path_ymd", className: "", width: "100px" },
        { data: (data, type, dataToSet) => {
          var o = this.PathCareer.filter(x => x.gen_cd === data.path_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
          else return "";
        }, className: "", width: "200px" },
        {
          data: (data, type, dataToSet) => {
            var o = this.Org.filter(x => x.org_cd === data.from_org_cd);
            if (o.length > 0) return o[0].org_nm_local;
            else return "";
          }, className: "", width: "200px"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.Org.filter(x => x.org_cd === data.to_org_cd);
            if (o.length > 0) return o[0].org_nm_local;
            else return "";
          }, className: "", width: "200px"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.Salary.filter(x => x.gen_cd === data.from_job_type_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.Salary.filter(x => x.gen_cd === data.to_job_type_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.HRClass.filter(x => x.gen_cd === data.from_hr_class_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.HRClass.filter(x => x.gen_cd === data.to_hr_class_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.DutyKind.filter(x => x.gen_cd === data.from_duty_kind_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },{
          data: (data, type, dataToSet) => {
            var o = this.DutyKind.filter(x => x.gen_cd === data.to_duty_kind_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },{
          data: (data, type, dataToSet) => {
            var o = this.DutyType.filter(x => x.duty_type_id === data.from_duty_type_id);
            if (o.length > 0) return o[0].duty_type_nm;
            else return "";
          }, className: "", width: "200px"
        },{
          data: (data, type, dataToSet) => {
            var o = this.DutyType.filter(x => x.duty_type_id === data.to_duty_type_id);
            if (o.length > 0) return o[0].duty_type_nm;
            else return "";
          }, className: "", width: "200px"
        },{
          data: (data, type, dataToSet) => {
            var o = this.WorkPlace.filter(x => x.gen_cd === data.from_work_place_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },{
          data: (data, type, dataToSet) => {
            var o = this.WorkPlace.filter(x => x.gen_cd === data.to_work_place_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },{
          data: (data, type, dataToSet) => {
            var o = this.TaxCode.filter(x => x.gen_cd === data.from_tax_cd_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },{
          data: (data, type, dataToSet) => {
            var o = this.TaxCode.filter(x => x.gen_cd === data.to_tax_cd_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },{
          data: (data, type, dataToSet) => {
            var o = this.DutyStatus.filter(x => x.gen_cd === data.from_duty_status_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },{
          data: (data, type, dataToSet) => {
            var o = this.DutyStatus.filter(x => x.gen_cd === data.to_duty_status_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "";
          }, className: "", width: "200px"
        },
        { data: "reason", className: "", width: "auto" },
      ],
      // scrollY: 210,
      scrollX: true,
      paging: true,
      buttons: [
        {
          text: '<i class="fa fa-plus" title="Add"></i>',
          action: (e, dt, node, config) => {
            this.isAdd = true;
            this.pushFormData()
            this.openPopupPathCareer();
          }
        },
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            //this.onReset();
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
              var selectedText: string = rowSelected.path_gen_cd;
              this.notification.confirmDialog(
                "Delete System-menu Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrNewCareerService.DeleteHrPathCare(this.pathCareerInfo).then(data => {
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
  //
  pushFormData() {
    this.formData.push(this.Org, this.Salary, this.HRClass, this.DutyKind, this.DutyType, this.DutyStatus, this.WorkPlace, this.TaxCode, this.PathCareer)
  }
  //
  onRowClick(event) {
    setTimeout(() => {
      this.pathCareerInfo = event;
      this.pushFormData()
      this.isAdd = false;
      this.openPopupPathCareer();
    }, 100);

  }
  reloadDatatable() {
    $(".eplPathCareList")
      .DataTable()
      .ajax.reload();
  }

  openPopupPathCareer() {
    if (!this.hrId || this.hrId == '') {
      this.notification.showMessage("warning", 'Please select an employee!');
      return;
    }
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupPathCareer, config);
  }
  closePopupPathCareer() {
    this.modalRef && this.modalRef.hide();
  }
}

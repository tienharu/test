import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService, AuthService, OrganizationMasterService, ProgramService } from '@app/core/services';
import { HrSpecialSalaryService } from '@app/core/services/hr.services/hr-special-salary.service';
import { HrSpecialSalaryModel } from '@app/core/models/hr/hr-special-salary.model';
import { BasePage } from '@app/core/common/base-page';
import 'datejs';
import { HrSpecialSalaryDetailComponent } from '../special-salary-detail/special-salary-detail.component';
import { OrganizationModel } from '@app/core/models/organization.model';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { ProgramList } from '@app/core/common/static.enum';
@Component({
  selector: 'sa-special-salary',
  templateUrl: './special-salary.component.html',
  styleUrls: ['./special-salary.component.css']
})
export class HrSpecialSalaryComponent extends BasePage implements OnInit {
  @ViewChild(HrSpecialSalaryDetailComponent) hrSpSalaryDetail: HrSpecialSalaryDetailComponent;
  SPSalaryInfo: HrSpecialSalaryModel;
  departments: OrganizationModel[] = [];
  company: any[] = [];
  year: any[] = [];
  month: any[] = [];
  options: any;
  isDisabled: boolean = false;
  yearFilter: any;

  constructor(
    private notification: NotificationService,
    public userService: AuthService,
    public programService: ProgramService,
    private hrSpecialSalaryService: HrSpecialSalaryService,
    public organizationMasterService: OrganizationMasterService,
    private i18nService:I18nService
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Special_Payment_Item.valueOf());
    this.organizationMasterService.listOrganization(this.companyInfo.company_id).then(d => {
      this.departments = d;
    });
    this.SPSalaryInfo = this.hrSpecialSalaryService.getModel();
    this.SPSalaryInfo.company_id = this.loggedUser.company_id;
    this.SPSalaryInfo.orgid = 0;
    this.company.push(this.companyInfo);
    this.getYear();
    this.getMonth();
    this.yearFilter = new Date().getFullYear().toString();
    this.initDatatable();
  }
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      year: {
        required: true
      },
      month: {
        required: true
      },
      special_pay_item_id: {
        required: true
      },
      special_pay_item_nm: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      year: {
        required: "Please enter "
      },
      month: {
        required: "Please enter "
      },
      special_pay_item_id: {
        required: "Please enter "
      },
      special_pay_item_nm: {
        required: "Please enter "
      }
    }
  };
  getYear() {
    let y1 = new Date().addYears(-3);
    let y2 = new Date().addYears(0);
    while (y2 > y1) {
      y1 = y1.addYears(+1);
      this.year.push({ value: y1.toString('yyyy'), name: `Year: ${y1.toString('yyyy')}` })
    }
  }
  getMonth() {
    let m1 = new Date().addMonths(0);
    let m2 = new Date().addMonths(12);
    while (m2 > m1) {
      m1 = m1.addMonths(+1);
      this.month.push({ value: m1.toString('M'), name: `Month: ${m1.toString('MM')}` })
    }
  }
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrSpecialSalaryService
          .listHrSpecialSalary(this.loggedUser.company_id)
          .then(data => {
            callback({
              aaData: data.data
            });
          });
      },
      columns: [
        {
          data: (data, callback, settings) => {
            var p = this.company.filter(x => x.company_id === data.company_id);
            if (p.length > 0) return p[0].company_nm;
            else return "N/A"
          }, visible: false
        },
        { data: "year", className: "center", width: "40px" },
        { data: "month", className: "center", width: "40px" },
        { data: "special_pay_item_nm", width: "40px" },
        {
          data: (data, type, dataToSet) => {
            return data.tax_yn ? "Yes" : "No";
          },
          className: "center",
          width: "40px"
        }
      ],
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            this.reloadDatatable();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-trash-o" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if(!this.permission.canDelete){
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.special_pay_item_nm;
              this.notification.confirmDialog(
                "Delete Special Salary Confirmation",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrSpecialSalaryService
                      .DeleteHrSpecialSalary(rowSelected)
                      .then(data => {
                        if (data.error) {
                          this.notification.showMessage(
                            "error",
                            data.error.message
                          );
                        } else {
                          this.notification.showMessage(
                            "success",
                            data.message
                          );
                          this.reloadDatatable();
                        }
                      });
                  }
                }
              );
            }
          }
        },
        "copy",
        "csv",
        "pdf",
        "print"
      ],
      pageLength: 10,
      // language: {infoFiltered: "(filtrado _MAX_ elementos total)"}
      info: false
    };
    setTimeout(() => {
      this.filterByYear(this.yearFilter)
    }, 100);
  }
  filterByYear(event) {
    $('.SPSalaryList').DataTable().column(1).search(event).draw();
  }
  onSubmit() {
    this.hrSpecialSalaryService.insertHrSpecialSalary(this.SPSalaryInfo).then(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.hrSpecialSalaryService.resetModel();
        this.SPSalaryInfo = this.hrSpecialSalaryService.getModel();
        this.SPSalaryInfo.company_id = this.companyInfo.company_id;
        this.reloadDatatable();
      }
    })
  }
  onReset() {
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.reloadDatatable();
  }
  onRowClick(event) {
    setTimeout(() => {
      this.SPSalaryInfo = event;
      this.isDisabled = true;
      this.hrSpSalaryDetail.getDataFromMain(this.SPSalaryInfo, false);
    }, 100);
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
  }

  searchEmployee() {
    this.hrSpSalaryDetail.getDataFromMain(this.SPSalaryInfo, false);
  }

  private reloadDatatable() {
    $(".SPSalaryList")
      .DataTable()
      .ajax.reload();
    this.isDisabled = false;
    this.hrSpecialSalaryService.resetModel();
    this.SPSalaryInfo = this.hrSpecialSalaryService.getModel();
    this.SPSalaryInfo.company_id = this.companyInfo.company_id;
    this.hrSpSalaryDetail.getDataFromMain(this.SPSalaryInfo, true);
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
}
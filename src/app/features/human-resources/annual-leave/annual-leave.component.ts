import { Component, OnInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';

import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { NotificationService, AuthService, UserMasterService, OrganizationMasterService, ProgramService } from '@app/core/services';
import { HrAnnualLeaveService } from '@app/core/services/hr.services/hr-annual-leave.service';
import { HrAnnualLeaveModel, HrAnnualLeaveApprlModel } from '@app/core/models/hr/hr-annual-leave.model';
import { FactoryModel } from '@app/core/models/factory.model';
import { NgForm } from '@angular/forms';
import { Category } from '@app/core/common/static.enum';
import { HrMainInfoService } from '@app/core/services/hr.services/hr-main-info.service';
import { HrShiftworkModel } from '@app/core/models/hr/hr-shiftwork.model';
import { OrganizationModel } from '@app/core/models/organization.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'sa-annual-leave',
  templateUrl: './annual-leave.component.html',
  styleUrls: ['./annual-leave.component.css']
})
export class AnnualLeaveComponent extends BasePage implements OnInit {
  company: any = [];
  factories: any = [];
  annualLeaveTypes: any = [];
  employee: any = [];
  employeeFiltered: any = [];
  users: any = [];
  hrAnnualLeaveModel: HrAnnualLeaveModel;
  hrAnnualLeaveApprlModel: HrAnnualLeaveApprlModel;
  departs: OrganizationModel[] = [];
  validationOptions: any
  isUpdating: boolean = false;
  isApprlHidden: boolean = false;
  isDelete: boolean = false;

  optionsDatePicker: any = {}
  options: any;
  reloadEmp = true;
  constructor(
    private notificationService: NotificationService,
    private organizationMasterService: OrganizationMasterService,
    private generalMasterService: GeneralMasterService,
    private hrMainInfoService: HrMainInfoService,
    public userService: AuthService,
    public userMasterService: UserMasterService,
    public programService: ProgramService,
    private route: ActivatedRoute,
    private hrAnnualLeaveService: HrAnnualLeaveService,
  ) {
    super(userService);
  }


  ngOnInit() {
    // console.log(this.companyInfo)
    // console.log(this.loggedUser)
    this.hrAnnualLeaveModel = this.hrAnnualLeaveService.initModel(this.companyInfo.company_id);
    this.hrAnnualLeaveApprlModel = this.hrAnnualLeaveService.initApprlModel(this.loggedUser.user_cd, this.loggedUser.user_name);
    this.loadGeneralInfo();
    this.initValidation();
    this.initDatatable();
    // console.log('---------')
    // console.log(this.hrAnnualLeaveModel)

  }
  loadGeneralInfo() {
    this.company.push(this.companyInfo)
    this.loadEmployee().then(data => {
      this.employee.push(...data.data)
      // console.log(this.employee)
    })

    this.loadDepart().then(data => {
      this.departs.push(...data)
    })
    this.loadAnnualType().then(data => {
      var filter = data.filter(x => x.ck_value_1 == "1");
      this.annualLeaveTypes.push(...filter)
    })
    this.loadListUser().then(data => {
      this.users.push(...data)
    })
  }
  loadEmployee() {
    return this.hrMainInfoService.listEmployee(this.companyInfo.company_id);
  }
  loadEmployeeFiltered(departId) {
    return this.hrMainInfoService.listEmployeeDepart(this.companyInfo.company_id, departId);
  }
  loadDepart() {
    return this.organizationMasterService.listOrganization(this.companyInfo.company_id)
  }
  loadAnnualType() {
    return this.generalMasterService.listGeneralByCate(Category.AttendLogType);
  }
  loadListUser() {
    return this.userMasterService.listUsers();
  }
  initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        Promise.all([this.loadEmployee, this.loadAnnualType, this.loadListUser]).then(res => {
          //console.log('employee',this.employee.length)
          this.hrAnnualLeaveService.getListAnnualLeave(this.loggedUser.company_id).then(data => {
            console.log(data)
            setTimeout(() => {
              callback({
                aaData: data
              })
            }, 500);
          })
        })
      },
      columns: [
        { data: "hr_id", class: "center", width: "100px" },
        {
          data: (row) => {
            var f = this.employee.filter(x => x.hr_id == row.hr_id);
            if (f.length > 0)
              return f[0].employee_nm;
            else
              return "N/A";
          }, width: "300px"
        },
        {
          data: (row) => {
            var a = this.annualLeaveTypes.filter(x => x.gen_cd === row.attend_log_gen_cd);
            if (a.length > 0)
              return a[0].gen_nm;
            else
              return "N/A";
          }, width: "200px"
        },
        { data: "from_date", className: "center", width: "200px" },
        { data: "to_date", className: "center", width: "200px" },
        { data: "total_day", className: "right", width: "50px" },
        {
          data: (data, type, dataToSet) => {
            return data.apprl_yn ? "Yes" : "No";
          },
          className: "center", width: "50px"
        },
        {
          data: (data, type, dataToSet) => {
            var u = this.users.filter(x => x.user_id === data.apprl_by);
            if (u.length > 0)
              return u[0].user_nm;
            else
              return "";
          }, width: "100px"
        },
        { data: "apprl_date", class: "center", width: "100px" },
        { data: "reason_nm", width: '300px' },
      ],
      pageLength: 25,
      scrollY: 500,
      scrollX: true,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-times text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            var rowSelected = dt.row({ selected: true }).data();
            rowSelected.json_language = "";
            if (rowSelected) {
              var selectedText: string = rowSelected.hr_id;
              this.notificationService.confirmDialog(
                "Delete Attendance Confirmation!",
                `Are you sure to delete hr ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrAnnualLeaveService.deleteAnnualLeave(this.hrAnnualLeaveModel).then(data => {
                      if (!data.success) {
                        this.notificationService.showMessage("error", data.data.message);
                      } else {
                        this.notificationService.showMessage(
                          "success",
                          "Deleted successfully"
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
        {
          extend: "copy",
          text: "Copy"
        },
        {
          extend: "csv",
          text: "Excel"
        },
        {
          extend: "pdf",
          text: "Pdf"
        },
        {
          extend: "print",
          text: "Print"
        }
      ]
    }
  }
  reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();

  }
  onRowClick(event) {
    this.isDelete = true;
    $("form.frm-detail")
      .validate()
      .resetForm();

    this.hrAnnualLeaveModel = event


    this.hrAnnualLeaveApprlModel.company_id = this.hrAnnualLeaveModel.company_id
    this.hrAnnualLeaveApprlModel.hr_id = this.hrAnnualLeaveModel.hr_id
    this.hrAnnualLeaveApprlModel.trans_seq = event.trans_seq

    this.isUpdating = true;
    this.isApprlHidden = true;

    this.reloadEmp = false;
    let hrId = this.hrAnnualLeaveModel.hr_id;
    let empNm = this.employee.filter(x => x.hr_id == hrId);
    this.employeeFiltered = [{ hr_id: this.hrAnnualLeaveModel.hr_id, employee_nm: empNm[0].employee_nm }]
    this.hrAnnualLeaveModel.hr_id = hrId;


  }
  onSubmit() {

    this.hrAnnualLeaveService.insertOrUpdateAnnualLeave(this.hrAnnualLeaveModel).then(data => {
      if (!data.success) {
        this.notificationService.showMessage("error", data.message);
      } else {
        this.notificationService.showMessage("success", data.message);
        this.reloadDatatable();
      }
    })
    // console.log(this.hrAnnualLeaveModel)
  }
  onApprl() {
    this.hrAnnualLeaveService.apprlAnnualLeave(this.hrAnnualLeaveApprlModel).then(data => {
      if (!data.success) {
        this.notificationService.showMessage("error", data.message);
      } else {
        this.notificationService.showMessage("success", data.message);
        this.isApprlHidden = false;
        this.reloadDatatable();
      }
    })
  }
  onReset() {
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.hrAnnualLeaveModel = this.hrAnnualLeaveService.initModel(this.companyInfo.company_id);

    // this.employeeFiltered = null;
    // this.employee = null;
    this.isUpdating = false;
    this.isApprlHidden = false;
    this.isDelete = false
    this.reloadEmp = true;
    // console.log(this.hrAnnualLeaveModel.from_date)
    this.reloadDatatable();
  }
  initValidation() {
    this.optionsDatePicker = {
      onClose: function () {
        $('.datePicker').valid();
      }
    }
    this.validationOptions = {
      ignore: [],
      rules: {
        factory_id: {
          required: true
        },
        from_date: {
          required: true,
        },
        to_date: {
          required: true,
          greaterThanOrEqual: "from_date"
        },
        annual_leave_gen_cd: {
          required: true
        },
        hr_id: {
          required: true
        },
      },
      // Messages for form validation
      messages: {
        factory_id: {
          required: "Please select factory"
        },
        from_date: {
          required: "Please select from date"
        },
        to_date: {
          required: "Please select to date",
          greaterThanOrEqual: "To date must greater than or equal From date !"
        },
        annual_leave_gen_cd: {
          required: "Please select type annual"
        },
        hr_id: {
          required: "Please select employee"
        }
      }
    };
  }
  onDepartChange(value) {
    // console.log('-----')
    console.log('onDepartChange', this.reloadEmp)

    if (this.reloadEmp) {
      this.loadEmployeeFiltered(value).then(data => {
        this.employeeFiltered = data
        // console.clear()
      })
    }

  }
  onDelete() {
    var selectedText: string = ''
    this.notificationService.confirmDialog(
      "Delete Language Confirmation!",
      `Are you sure to delete ${selectedText}?`,
      x => {
        if (x) {
          this.hrAnnualLeaveService.deleteAnnualLeave(this.hrAnnualLeaveModel).then(data => {
            if (!data.success) {
              this.notificationService.showMessage("error", data.data.message);
            } else {
              this.notificationService.showMessage(
                "success",
                "Deleted successfully"
              );
              this.reloadDatatable();
              this.onReset();
            }
          });
        }
      }
    );
  }
  onHRChange(hrId) {
    if (this.reloadEmp) {
      this.hrAnnualLeaveModel.hr_id = hrId;
    }
  }

  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }






}
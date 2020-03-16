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
import { OrganizationModel } from '@app/core/models/organization.model';
import { HrShiftworkModel } from '@app/core/models/hr/hr-shiftwork.model';
import { TypeaheadMatch } from 'ngx-bootstrap';
@Component({
  selector: 'sa-annual-leave',
  templateUrl: './posting-attendance-list.component.html',
  styleUrls: ['./posting-attendance-list.component.css']

})
export class PostingAttendanceListComponent extends BasePage implements OnInit {
  company: any = [];
  factories: any = [];
  departs: OrganizationModel[] = [];
  shiftworkInfo: HrShiftworkModel = new HrShiftworkModel();
  annualLeaveTypes: any = [];
  employee: any = [];
  users: any = [];

  hrAnnualLeaveModel: HrAnnualLeaveModel;
  hrAnnualLeaveApprlModel: HrAnnualLeaveApprlModel;
  listHrAnnualLeaveApprlModel: any[];

  validationOptions: any
  isUpdating: boolean = false;
  isApprlHidden: boolean = false;
  optionsDatePicker: any = {}
  options: any;
  constructor(
    private notificationService: NotificationService,
    private organizationMasterService: OrganizationMasterService,
    private generalMasterService: GeneralMasterService,
    private hrMainInfoService: HrMainInfoService,
    public userService: AuthService,
    public programService: ProgramService,
    public userMasterService: UserMasterService,
    private orgService: OrganizationMasterService,

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
    this.initDataTable();
    this.multiCheck();
    this.checkAll();

  }
  loadGeneralInfo() {
    this.company.push(this.companyInfo)
    this.loadEmployee().then(data => {
      this.employee.push(...data.data)
    })
    this.loadFactory().then(data => {
      this.factories.push(...data)
      // console.log(this.factories)
    })
    this.loadAnnualType().then(data => {
      var filter = data.filter(x => x.ck_value_1 == "1");
      this.annualLeaveTypes.push(...filter)
    })
    this.loadListUser().then(data => {
      this.users.push(...data)
    })
    this.loadDepart().then(data => {
      this.departs.push(...data);
    })
  }
  loadEmployee() {
    return this.hrMainInfoService.listEmployee(this.companyInfo.company_id);
  }
  loadFactory() {
    return this.organizationMasterService.listFactory(this.companyInfo.company_id);
  }
  loadAnnualType() {
    return this.generalMasterService.listGeneralByCate(Category.AttendLogType);
  }
  loadListUser() {
    return this.userMasterService.listUsers();
  }
  private loadDepart() {
    return this.orgService.listOrganization(this.companyInfo.company_id)
  }
  initDataTable() {
    this.options = {
      dom: "Bfrtip",
      pageLength: 25,
      scrollY: 500,
      scrollX: true,
      multiSelect: true,
      ajax: (data, callback, settings) => {
        Promise.all([this.loadEmployee, this.loadAnnualType, this.loadFactory, this.loadListUser]).then(res => {
          this.hrAnnualLeaveService.getListAnnualLeaveNotApprl(this.loggedUser.company_id, null, this.shiftworkInfo.depart_id).then(data => {
            this.listHrAnnualLeaveApprlModel = data
            setTimeout(() => {
              callback({
                aaData: data
              })
            }, 1);
          })
        })
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            if (!data.apprl_yn) {
              return '<input type="checkbox"/>'
            } else {
              return ''
            }
          },
          className: "center",
        },
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
        { data: "from_date", className: "center", width: "100px" },
        { data: "to_date", className: "center", width: "100px" },
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

      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
          }
        },
        {
          text: '<i class="fa fa-upload"></i> Post selected',
          action: (e, dt, node, config) => {
            var table = $('.dataTable').DataTable();
            let listSelected = [];
            listSelected.push(...table.rows('.selected').data());
            if (listSelected.length > 0) {
              this.batchPosting(listSelected)
            }
            else {
              this.notificationService.showMessage("warning", "Select item please or all list applied");
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
  searchData() {
    this.initDataTable();
    this.reloadDatatable();
  }

  reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();

  }
  onRowClick(event) {

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
          greaterThan: "from_date"
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
          greaterThan: "To date must greater than From date !"
        },
        annual_leave_gen_cd: {
          required: "Please select type annual"
        },
        hr_id: {
          required: "Please select Hr"
        }
      }
    };
  }
  checkAll() {
    $('.checkAll').on('click', function () {
      let table = $(".dataTable").DataTable()
      var rows = table.rows({ 'search': 'applied' }).nodes();
      $('input[type="checkbox"]', rows).toggleClass("ahihi")
    });
  }
  multiCheck() {
    $(document).ready(function () {
      $('.dataTable tbody').on('click', 'tr', function () {
        var selectedClass = $(this).attr('class')
        var element = $(this).find('td:first input[type=checkbox]')
        if (selectedClass == 'odd selected' || selectedClass == 'even selected') {
          element.attr('checked', true)
        } else {
          element.attr('checked', false)
        }
      });
    });
  }
  headPostAll() {
    if (this.listHrAnnualLeaveApprlModel.length > 0) {
      this.batchPosting(this.listHrAnnualLeaveApprlModel)
    }
    else {
      this.notificationService.showMessage("warning", "All list applied");
    }
  }
  batchPosting(listPosting) {
    for (let item of listPosting) {
      item.apprl_by = this.loggedUser.user_cd
      item.changer = this.loggedUser.user_name
    }
    this.hrAnnualLeaveService.batchApprlAnnualLeave(listPosting).then(data => {
      if (!data.success) {
        this.notificationService.showMessage("error", data.message);
      } else {
        this.notificationService.showMessage("success", data.message);
        this.isApprlHidden = false;
        this.reloadDatatable();
      }
    })
  }

  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}
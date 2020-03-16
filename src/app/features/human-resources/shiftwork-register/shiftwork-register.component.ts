import { Component, OnInit } from '@angular/core';
import { OrganizationMasterService, NotificationService, AuthService, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { BasePage } from '@app/core/common/base-page';
import { OrganizationViewModel, OrganizationModel } from '@app/core/models/organization.model';
import { HrShiftworkService } from '@app/core/services/hr.services/shiftwork.service';
import { HrShiftworkModel } from '@app/core/models/hr/hr-shiftwork.model';
import 'datejs'
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { Category } from '@app/core/common/static.enum';
import { getDay } from 'ngx-bootstrap/chronos/utils/date-getters';
import { DutyTypeModel } from '@app/core/models/hr/hr-mas-duty-type.model';
import { DutyTypeService } from '@app/core/services/hr.services/hr-mas-dutytype.service';
@Component({
  selector: 'sa-shiftwork-register',
  templateUrl: './shiftwork-register.component.html',
  styleUrls: ['./shiftwork-register.component.css']
})
export class ShiftworkRegisterComponent extends BasePage implements OnInit {
  //factories: FactoryModel[] = [];
  selectedDepart: OrganizationModel;
  departs: OrganizationModel[] = [];
  dutyTypes: DutyTypeModel[] = [];
  monthsYear: any = [];
  shiftworkInfo: HrShiftworkModel = new HrShiftworkModel();
  shiftWorkTable: any;
  isCreated: boolean;
  isDepartHasChild:boolean=false;
  hasChanged: boolean = false;
  savingAllChanges: boolean = false;
  daysInMonth: number;
  isChangingDutyType: boolean = false;
  changingHrId: any;
  changingDay: any;
  currentDutyType: any;
  selectedRowIndex:any;
  totalRows:number=0;
  constructor(
    private notification: NotificationService,
    private orgService: OrganizationMasterService,
    private dutyTypeService: DutyTypeService,
    private shiftworkService: HrShiftworkService,
    public userService: AuthService,
    public programService: ProgramService,
    private generalMasterService: GeneralMasterService) {
    super(userService);

  }
  private loadDutyType() {
    this.dutyTypeService.getDutyTypes().then(data => {
      this.dutyTypes=data.data;
    });
  }
  private loadYearMonths() {
    var d1 = new Date().addMonths(-6)
    var d2 = new Date().addMonths(6);
    var today = Date.today();
    while (d2 > d1) {
      d2 = d2.addMonths(-1);
      //console.log(d2.toString('yyyy-MM'))
      var ym = d2.toString('yyyy-MM');
      if (ym == today.toString('yyyy-MM')) {
        this.shiftworkInfo.month = today.getMonth() + 1;
        this.shiftworkInfo.year = today.getFullYear();
        this.daysInMonth = Date.getDaysInMonth(today.getFullYear(), today.getMonth());
        this.shiftworkInfo.month_year = ym;
      }
      this.monthsYear.push({ text: ym, val: ym });
    }
  }
  // private loadFactories() {
  //   return this.orgService.listFactory(this.companyInfo.company_id)
  // }
 
  private loadDepart() {
    return this.orgService.listOrganization(this.companyInfo.company_id)
  }
  ngOnInit() {
    this.shiftworkInfo.company_id = this.companyInfo.company_id;
    this.loadYearMonths();
    // this.loadFactories().then(data => {
    //   this.factories.push(...data);
    // });
   
    this.loadDepart().then(data => {
      this.departs=data;
      // if(data.length){
      //   data.forEach(o => {
      //     let model=new OrganizationViewModel();
      //     model.company_id=o.company_id;
      //     model.org_cd=o.org_cd;
      //     model.has_child=o.has_child;
      //     model.org_tree_nm=o.org_tree_nm;
      //     model.org_nm_local=o.org_nm_local;
      //     model.org_nm_eng=o.org_nm_eng;
      //     model.parent_org_id=o.parent_org_id;
      //     model.level=o.level;
      //     model.factory_yn=o.factory_yn;
      //     this.departs.push(model)
          
      //   });
      // }
    });
    this.loadDutyType();

  }
  searchData() {
    console.log(this.shiftworkInfo)
    this.isChangingDutyType=false;
    if (this.shiftworkInfo.depart_id > 0 && this.shiftworkInfo.month > 0 && this.shiftworkInfo.year > 0) {
      //console.log(factoryId,departId,m,y)
      this.notification.showCenterLoading();
      this.shiftworkService.getShiftWorkTable(this.companyInfo.company_id, this.shiftworkInfo.depart_id, this.shiftworkInfo.month, this.shiftworkInfo.year, this.shiftworkInfo.hr_id).then(data => {
        this.notification.hideCenterLoading();
        if (data.error) {
          this.notification.showMessage("error", data.error.message);
          return;
        }
        if (data.data.shiftwork_table.length==0) {
          //this.notification.showMessage("info", data.message);
          this.isCreated = false;
          this.shiftWorkTable = [];
          return;
        }
        this.isCreated = true;
        this.shiftWorkTable = data.data.shiftwork_table;
        this.totalRows=data.data.shiftwork_table.length;
        //this.notification.showMessage("success", 'Shift-work table was created successfully', { titmeOut: 1000 });
        //console.log(this.shiftworkInfo, this.shiftWorkTable)
      });
    }
    else {
      this.notification.showInfo('Please select department', { titmeOut: 1000 });
    }
  }
  
  onMonthChanged(my) {
    var m = my.split('-')[1];
    var y = my.split('-')[0];
    this.shiftworkInfo.month = m;
    this.shiftworkInfo.year = y;
    this.daysInMonth = Date.getDaysInMonth(y, m);
  }
  onDepartChanged(e){
    var dp= this.departs.filter(x=>x.org_cd==e)
    if(dp.length>0){
      this.selectedDepart=dp[0];
      this.isDepartHasChild=dp[0].has_child>0;
    }
  }
  editADay(el, hrId, day, val) {
     var cellElement = $(el.target)
    if (cellElement.hasClass('cell-selected') || cellElement.parent().hasClass('cell-selected')) {
      return;
    }
     $("#tblShiftwork td.cell-editable.cell-selected").removeClass('cell-selected')
    // var oldSelectedCell = $("#tblShiftwork td.cell-editable").find('input');
    // if (oldSelectedCell.length > 0) {
    //   let ov = $(oldSelectedCell[0]).val();
    //   $(oldSelectedCell[0]).parent().html(ov)
    // }

    cellElement.addClass('cell-selected')
    this.isChangingDutyType = true;
    this.changingHrId = hrId;
    this.changingDay = day;
    this.currentDutyType = cellElement.text();

    this.selectedRowIndex = parseInt(cellElement.parent().find('td:first').text()) - 1;
    console.log('selectedRowIndex',this.selectedRowIndex)
  }
  resetCellsChanged() {
    this.notification.confirmDialog('Shift-work table clear changes confirmation', `Do you want to clear all changes?`, (x) => {
      if (x) {
        this.searchData();
        this.hasChanged = false;
        this.isChangingDutyType=false;
      }
    })
    // $("#tblShiftwork td.cell-editable.cell-selected").removeClass('cell-selected')
    // $("#tblShiftwork td.cell-editable.cell-changed").removeClass('cell-changed').text('')
    // var oldSelectedCell=$("#tblShiftwork td.cell-editable").find('input');
    // if(oldSelectedCell.length>0){
    //   let ov=$(oldSelectedCell[0]).val();
    //   $(oldSelectedCell[0]).parent().html(ov)
    // }
  }

  saveCellsChanged() {
    this.notification.confirmDialog('Shift-work table save changes confirmation', `Do you want to save all changes?`, (x) => {
      if (x) {
        console.log(this.shiftWorkTable)
        this.savingAllChanges = true;
        this.notification.showCenterLoading();
        this.shiftworkService.updateShiftworkTable(this.shiftworkInfo.depart_id, this.shiftWorkTable).then(data => {
          this.notification.hideCenterLoading();
          this.savingAllChanges = false;
          if (data.error) {
            this.notification.showMessage("error", data.error.message);
            return;
          }
          this.hasChanged = false;
          this.isChangingDutyType=false;
          this.searchData();
        })
      }
    })
  }

  onDutyTypeChanged(e) {
   
    var id = $("select[name='duty_type_id']").val();
    if (id != this.currentDutyType) {
      this.notification.showCenterLoading();
      this.copyNewValue(id);
      this.currentDutyType=id;
      this.notification.hideCenterLoading();
    }
  }
  copyNewValue(id) {
    var val = id;
    var day = this.changingDay;
    for (var i = this.selectedRowIndex; i < this.shiftWorkTable.length; i++) {
      var monthData = this.shiftWorkTable[i].monthly_data;
      var nextDays = monthData.filter(x => x.day >= day);
      if (nextDays.length > 0) {
        $.each(nextDays, (i, item) => {
          //item.duty_type_code = val;
          let dtype = this.dutyTypes.filter(x => x.duty_type_id == val);
          if (dtype.length > 0) {
            item.duty_type_id = dtype[0].duty_type_id;
            item.duty_type_name = dtype[0].duty_type_nm;
          }
          else {
          }
        })
        var td
        let nextTr = $("#tblShiftwork").find(`tr[id=${i + 1}]`)
          td = nextTr.find(`td[data-day=${day}]`)
        td.html(val);
        td.addClass('cell-changed');
        td.removeClass('cell-selected')
        var allTd = td.nextAll();
        $.each(allTd, function (i, e) {
          $(e).addClass('cell-changed');
        })
        if (!this.hasChanged) this.hasChanged = true;
      }
    }
    
  }

  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}


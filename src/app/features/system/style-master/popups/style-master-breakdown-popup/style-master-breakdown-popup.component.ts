import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, ProgramService } from '@app/core/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { StyleMasterPOCSModel } from '@app/core/models/style-master-po-cs-model';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { CommonFunction } from "@app/core/common/common-function";
import { Category } from '@app/core/common/static.enum';
import _ from "lodash";

@Component({
  selector: 'sa-style-master-breakdown-popup',
  templateUrl: './style-master-breakdown-popup.component.html',
  styleUrls: ['./style-master-breakdown-popup.component.css']
})
export class StyleMasterBreakDownPopupComponent extends BasePage implements OnInit, AfterViewInit {
  @Output() childCall = new EventEmitter();
  @Input() poId: number = null;
  @Input() styleSysId: number = null;
  @Input() sizeGroupCd: number = null;
  @Input() addNew: boolean = false;
  @Input() styleColorsList: any = [];

  sizeGroups: any = [];
  styleColors: any = [];
  isEdit: boolean = false;
  selectedSize: any = null;
  data: any = [];
  rows: any = [];
  size_gen_cd: string = "";
  options: any;
  modalRef: BsModalRef;
  all_qty: number = 0;
  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    public styleMasterService: StyleMasterService,
    private modalService: BsModalService,
    public generalMasterService: GeneralMasterService
  ) {
    super(userService);
  }

  public validationOptions: any = {
    ignore: [],
    rules: {
      size_group: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      size_group: {
        required: "Please select",
      }
    }
  };

  ngOnInit() {
    var self = this;
    self.isEdit = self.poId !== null && self.styleSysId !== null;
    self.loadAllData().then(function () {
      return self.loadPOCSList();
    }).then(function () {
      self.totalQty();
    });
  }

  ngAfterViewInit(): void {
    // let table = $('.tableItem').DataTable();
    // table.clear();
    // table.rows.add(this.bomItems).draw();
  }

  onChangeSizeGroup(value) {
    if (!value) {
      this.selectedSize = null;
      return;
    }
    this.selectedSize = _.find(this.sizeGroups, { "gen_cd": value });
  }

  createColumn() {
    var self = this;
    self.rows = [];
    // self.notification.showCenterLoading();
    const _invalid = $("form.frm-po-cs").valid();
    if (!_invalid || !self.selectedSize) {
      // this.notification.hideCenterLoading();
      if (!self.selectedSize) {
        this.notification.showError('Please select size group.');
      }
      return;
    }
    var arr = self.selectedSize.gen_nm.split('-');
    _.forEach(this.styleColors, (size, idx) => {
      size.columns = _.map(arr, (item, index) => {
        var obj = {
          name: 'Size ' + item.trim(),
          sizeId: parseInt(item), //parseInt((parseInt(index, 10) + 101).toString().substr(1)),
          qty: 0,
          id: CommonFunction.generateId()
        };
        return obj;
      });
      size.total = _.sumBy(size.columns, "qty");
    });
    self.rows = _.map(arr, (item, index) => {
      var obj = {
        name: 'Size ' + item.trim(),
      };
      return obj;
    });
  }

  onClose() {
    this.modalService.hide(1);
  }

  totalQty() {
    this.all_qty = _.sumBy(this.styleColors, "total");
  }

  save() {
    var self = this;
    var poCsList = [];
    self.totalQty();
    _.forEach(self.styleColors, function (item) {
      _.forEach(item.columns, function (r) {
        var obj = new StyleMasterPOCSModel();
        obj.styleSysId = self.styleSysId;
        obj.colorId = item.colorId;
        obj.qty = r.qty;
        obj.sizeId = r.sizeId;
        obj.poId = r.poId;
        obj.companyId = r.companyId,
          obj.useYn = r.useYn,
          obj.remark = r.remark,
          obj.creator = r.creator,
          obj.createdTime = r.createdTime
        poCsList.push(obj);
      });
    });
    self.childCall.emit({
      pocsList: poCsList,
      total: self.all_qty,
      styleColors: self.styleColors,
      sizeGroupCd: self.selectedSize && self.selectedSize.gen_cd || self.sizeGroupCd
    });
    self.modalService.hide(1);
  }

  calculateTotal(item) {
    item.total = _.sumBy(item.columns, "qty");
    this.totalQty();
  }

  trackByIndex(index: number, obj: any): any {
    return (obj && obj.id) || (obj && obj.colorId) || index;
  }

  private loadPOCSList() {
    var self = this;
    if (self.poId && self.styleColorsList.length === 0) {
      return self.styleMasterService.getStyleMasterPOCSByPo(self.poId).then(function (rs) {
        if (rs.success) {
          self.data = rs.data;
        }
        if (self.sizeGroupCd) {
          self.size_gen_cd = self.sizeGroupCd + "";
          self.selectedSize = _.find(self.sizeGroups, { "gen_cd": self.sizeGroupCd });
          self.createColumn();
          _.forEach(self.styleColors, function (item) {
            _.forEach(item.columns, function (r) {
              var po_cs = _.find(self.data, function (po) {
                return parseInt(po.sizeId) === parseInt(r.sizeId) && parseInt(item.colorId) === parseInt(po.colorId);
              });
              if (po_cs) {
                r.qty = po_cs.qty;
                r.poId = po_cs.poId;
                r.companyId = po_cs.companyId,
                  r.useYn = po_cs.useYn,
                  r.remark = po_cs.remark,
                  r.creator = po_cs.creator,
                  r.createdTime = po_cs.createdTime
              }
            });
            item.total = _.sumBy(item.columns, "qty");
          });
        }
      });
    }
  }

  private loadAllData() {
    return this.getSizeGroup().then(() => {
      return this.getStyleColors();
    });
  }

  private getSizeGroup() {
    return this.generalMasterService.listGeneralByCate(Category.SizeGroup.valueOf()).then(data => this.sizeGroups.push(...data));
  }

  private getStyleColors() {
    var self = this;
    if (self.styleSysId) {
      return self.styleMasterService.getStyleMasterColorByStyle(self.styleSysId).then(function (rs) {
        if (rs.success) {
          self.styleColors = rs.data;
          //  _.filter(rs.data, function (item, index) {
          //   return item.colorType === true;
          // });
          if (self.sizeGroupCd) {
            self.size_gen_cd = self.sizeGroupCd + "";
            self.selectedSize = _.find(self.sizeGroups, { "gen_cd": self.sizeGroupCd });
            var arr = self.selectedSize.gen_nm.split('-');
            self.rows = _.map(arr, (item, index) => {
              var obj = {
                name: 'Size ' + item.trim(),
              };
              return obj;
            });
          }
          _.forEach(self.styleColors, (size, idx) => {
            var existed = _.find(self.styleColorsList, function (s) {
              return s.colorId === size.colorId;
            })
            size.total = existed ? existed.total : 0;
            size.columns = existed && existed.columns && existed.columns.length > 0 ? existed.columns : [];
          });
        }
      });
    }
  }
}

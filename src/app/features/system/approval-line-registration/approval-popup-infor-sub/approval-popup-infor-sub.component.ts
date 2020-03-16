import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash'
import { DefaultEditor } from 'ng2-smart-table';
import { BomItem } from '@app/core/models/bom-assy-master.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GeneralMasterModel } from '@app/core/models/general_master.model';

@Component({
  selector: 'sa-approval-popup-infor-sub',
  templateUrl: './approval-popup-infor-sub.component.html',
  styleUrls: ['./approval-popup-infor-sub.component.css', '../../../../../assets/css/smart-table.scss','../approval-line-registration.component.css']
})
export class ApprovalLineRegiatrationSubComponent extends DefaultEditor implements OnInit, AfterViewInit {

  @ViewChild('popupApprovalLineComponent') popupApprovalLineComponent: ElementRef;
  modalRef: BsModalRef;
  name: string = '';
  constructor(
    private modalService: BsModalService,
  ) {
    super();
  }

  ngOnInit() { 
    let editor = this.cell.getColumn().editor;
    var id = this.cell.getId();
    var row = this.cell.getRow();
    this.name = id;
    if (row && row.index === -1) {
        this.name += '_' + (row.index + 1);
    }
  }

  ngAfterViewInit(): void {
  }

  onShowPopupInitTable() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupApprovalLineComponent, config);
  }

  closePopup() {
    this.modalRef && this.modalRef.hide();
  }

  getBomItem(bomItem) {
    this.onChange(bomItem);
  }

  onChange(item) {
    //moi khi change select gan lai du lieu vào cell tren ng2-smart-table
    var rows = this.cell.getRow();
        rows.cells[6].newValue = item.user_id;
        rows.cells[7].newValue = item.position_gen_cd;
  }
}

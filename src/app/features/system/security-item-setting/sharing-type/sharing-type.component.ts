import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash'
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-sharing-type',
  templateUrl: './sharing-type.component.html',
  styleUrls: ['./sharing-type.component.css']
})
export class SharingTypeComponent extends DefaultEditor implements OnInit, AfterViewInit {

  @ViewChild('sharingTypeSelect') sharingTypeSelect: ElementRef;

  sharingType: any = []
  sharingTypeShow: any = []
  // @Output() filterSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    super();
  }

  ngOnInit() {
    this.sharingType = [
      { value: 1, title: 'Sharing Group' },
      { value: 2, title: 'Sharing User' },
    ]
    this.sharingTypeShow = [
      { value: 'Sharing Group', title: 'Sharing Group' },
      { value: 'Sharing User', title: 'Sharing User' },
    ]
    // this.cell.newValue = this.sharingTypeShow[0].value
    // this.cell['value'] = 'Group'
    // console.log('cel------',this.cell)
  }
  ngAfterViewInit(): void {
    //khi open editor se select dung voi gia tri cua cell
    this.sharingTypeSelect.nativeElement.value = this.cell['value'];
  }
  onChange(value) {
    //moi khi change select gan lai du lieu vào cell tren ng2-smart-table
    // console.log(value)
    this.cell.newValue = value
  }
}

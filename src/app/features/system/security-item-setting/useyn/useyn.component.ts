import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-useyn',
  template: `
              <input type="checkbox" style="text-align: center" (change)="checkValue($event.target.checked)" #useYnCheckbox>
            `,
  styleUrls: ['./useyn.component.css']
})
export class UseynComponent extends DefaultEditor implements OnInit, AfterViewInit {
  @ViewChild('useYnCheckbox') useYnCheckbox: ElementRef;
  constructor() {
    super()
  }
  ngOnInit() {
    // console.log(this.cell)
    if (this.cell.newValue == '')
      this.cell.newValue = 'No'
  }
  checkValue(value) {
    // console.log(value)
    if (value) {
      this.cell.newValue = 'Yes'
    }
    else {
      this.cell.newValue = 'No'
    }
  }
  ngAfterViewInit(): void {
    let isChecked = this.cell.getValue()
    if (isChecked == 'Yes') {
      this.useYnCheckbox.nativeElement.checked = true
    } else {
      this.useYnCheckbox.nativeElement.checked = false
    }
  }
}

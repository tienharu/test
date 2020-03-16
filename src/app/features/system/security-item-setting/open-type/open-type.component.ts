import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash'
import { ViewCell, DefaultEditor } from 'ng2-smart-table';
import { UserMasterService } from '@app/core/services/features.services/user-master.service';
import { SharingGroupService } from '@app/core/services/features.services/sharing-group.service';
import { AuthService } from '@app/core/services';
@Component({
  selector: 'app-all-value',
  templateUrl: './open-type.component.html',
  styleUrls: ['./open-type.component.css']
})
export class OpenTypeComponent extends DefaultEditor implements OnInit, AfterViewInit {

  @ViewChild('openTypeSelect') openTypeSelect: ElementRef;

  listGroup: any = [];
  listUser: any = [];

  loggedUserInfo: any = {};


  listOpenValue: any = [];
  listOpenValueShow: any = [];
  listOpenValueShowClone: any = [];


  constructor(
    private userMasterService: UserMasterService,
    public groupSharingService: SharingGroupService,
    public userService: AuthService,

  ) {
    super();
  }
  ngOnInit() {
    this.loggedUserInfo = this.userService.getUserInfo()
    this.getGroup().then(data => {
      this.listGroup.push(...data);
      // console.log('List group', this.listGroup)
    })
    this.getUser().then(data => {
      this.listUser.push(...data);
      // console.log('List user', this.listUser)
    })

    setTimeout(() => {
      for (let item of this.listGroup) {
        this.listOpenValue.push({ value: item.sharing_group_id, title: item.sharing_group_nm, type: 1 })
        this.listOpenValueShow.push({ value: item.sharing_group_nm, title: item.sharing_group_nm, type: 'Sharing Group' })
      }
      for (let item of this.listUser) {
        this.listOpenValue.push({ value: item.user_id, title: item.sharing_group_nm, type: 2 })
        this.listOpenValueShow.push({ value: item.user_nm, title: item.user_nm, type: 'Sharing User' })
      }
      // console.log('Mer', this.listOpenValueShow)
    }, 400);

    setTimeout(() => {
      this.listOpenValueShowClone = _.clone(this.listOpenValueShow)
      let value = $('select.sharingType').val()
      // console.log('value-----',value)
      //lan dau khoi tao se filter dropdown open type theo gia tri da select ben dropdown sharing type

      this.listOpenValueShowClone = _.filter(this.listOpenValueShow, c => c.type == value)
      // console.log('----------123', this.listOpenValueShowClone)
    }, 401);


    // this.cell.newValue = this.openTypeShow[0].value

    // console.log('value------', value)
    // console.log('cel------', this.cell)

  }
  getGroup() {
    return this.groupSharingService.listSharingGroup(this.loggedUserInfo.company_id);
  }
  getUser() {
    return this.userMasterService.listUsers();
  }
  ngAfterViewInit(): void {
    let that = this

    //khi open editor se select dung voi gia tri cua cell
    setTimeout(() => {
      this.openTypeSelect.nativeElement.value = this.cell['value'];
    }, 402);

    // bat su kien on change ben sharing type dropdown de filter lai open type dropdown
    $('select.sharingType').on('change', function () {
      let valueChange = $(this).val()
      // console.log(value)
      that.listOpenValueShowClone = _.filter(that.listOpenValueShow, c => c.type == valueChange)

      // //neu ko change open type select thi gan gia tri dau tien cua list vao cell 
      that.cell.newValue = that.listOpenValueShowClone[0].value;
    })
  }
  onChange(value) {
    this.cell.newValue = value
  }

}

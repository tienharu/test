import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { CanDeactivateGuard } from "@app/core/guards/can-deactivate-guard";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "@app/core/services/notification.service";
import { SystemMenuService } from "@app/core/services/features.services/system-menu.service";
import { SystemMenuModel } from "@app/core/models/system-menu.model";
import { AuthService } from "@app/core/services/auth.service";
import { LoggedUserInfoModel } from "@app/core/models/logged-user-info.model";
import { BasePage } from "@app/core/common/base-page";
import { SecurityItemService } from "@app/core/services/features.services/security-item.service";
import { SecurityItemModel } from "@app/core/models/security-item.model";
import { I18nService } from "@app/shared/i18n/i18n.service";
import { UserMasterService, ProgramService } from "@app/core/services";
import { SharingGroupService } from "@app/core/services/features.services/sharing-group.service";
import { SharingTypeComponent } from "./sharing-type/sharing-type.component";
import { OpenTypeComponent } from "./open-type/open-type.component";
import { UseynComponent } from "./useyn/useyn.component";
import { LocalDataSource } from "ng2-smart-table/lib/data-source/local/local.data-source";

@Component({
  selector: "sa-system-menu",
  templateUrl: "./security-item-setting.component.html",
  styleUrls: ["./security-item-setting.component.css"]
})
export class SecurityItemSettingComponent extends BasePage implements OnInit, AfterViewInit, CanDeactivateGuard {


  source: LocalDataSource;
  listSecurityItem: SecurityItemModel[] = [];
  listSecurityItemShow: any = [];

  // securityItemCRUD: SecurityItemModel;
  securityItemCRUD: any = {};


  listSharingItem: any = [];
  listSharingItemShow: any = [];

  listOpenType: any = [];
  listOpenTypeShow: any = [];

  listOpenValue: any = [];
  listOpenValueShow: any = [];

  detailInfo: SystemMenuModel;
  loggedUserInfo: any = {};
  listGroup: any = [];
  listUser: any = [];
  settings: any = {}
  constructor(
    private userMasterService: UserMasterService,
    public groupSharingService: SharingGroupService,
    public i18n: I18nService,
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private systemMenuService: SystemMenuService,
    private securityItemService: SecurityItemService,
    public programService: ProgramService,

    public userService: AuthService
  ) {
    super(userService);
  }

  ngOnInit() {
    this.generalInfo()
    this.loggedUserInfo = this.userService.getUserInfo()
    console.log(this.loggedUser)
    this.getGroup().then(data => {
      this.listGroup.push(...data);
      // console.log('List group', this.listGroup)
    })
    this.getUser().then(data => {
      this.listUser.push(...data);
      // console.log('List user', this.listUser)
    })
    setTimeout(() => {
      this.initTable();
    }, 800);
    // this.initTable();
    // $('.smartTable').each(function(){
    //   console.log('select', $(this))
    // })
    // $('.selected').find('select')
    // console.log('select', $(this))




  }
  getGroup() {
    return this.groupSharingService.listSharingGroup(this.loggedUser.company_id);
  }
  getUser() {
    return this.userMasterService.listUsers();
  }
  initTable() {
    this.settings = {
      // mode: 'external',
      delete: {
        confirmDelete: true,
      },
      add: {
        confirmCreate: true,
      },
      edit: {
        confirmSave: true,
        editButtonContent: this.i18n.getTranslation('BUTTON-EDIT'),
        saveButtonContent: this.i18n.getTranslation('BUTTON-SAVE'),
        cancelButtonContent: this.i18n.getTranslation('BUTTON-CANCEL'),
      },
      columns: {
        // company_id: {
        //   title: this.i18n.getTranslation('Company'),
        // },
        security_item_id: {
          filter: false,
          class: 'hajshfashfksahdfkjhsfk',
          title: this.i18n.getTranslation('SECURITY-ITEM'),
          // valuePrepareFunction: (value, a, b) => {
          //   switch (value) {
          //     case 1:
          //       return 'Sales Amount';
          //     case 2:
          //       return 'Order Amount';
          //     case 3:
          //       return 'Cost Order Amount';
          //     case 4:
          //       return 'Contract Amount';
          //     default:
          //       return 'N/A';
          //   }
          // },
          editor: {
            type: 'list',
            config: {
              list: this.listSharingItemShow,
            },
          },
          editable: false,

        },
        sharing_type: {
          title: this.i18n.getTranslation('OPEN-TYPE'),
          filter: false,
          type: 'html',
          editor: {
            type: 'custom',
            component: SharingTypeComponent,
            // type: 'list',
            // config: {
            //   list: this.listOpenTypeShow,
            // },
          }
        },
        sharing_to_id: {
          filter: false,
          title: this.i18n.getTranslation('OPEN-VALUE'),
          editor: {
            type: 'custom',
            component: OpenTypeComponent,
            // type: 'list',
            // config: {
            //   list: this.listOpenValueShow
            // },
          }
          // valuePrepareFunction: (value, dataRow) => {
          //   // console.log(dataRow)
          //   // return value
          // },
          // filterFunction(cell, search) {
          //   // if(cell == search){
          //   //   return cell;
          //   // }
          //   // console.log('cel', cell)
          // },
        },
        remark: {
          filter: false,
          title: this.i18n.getTranslation('REMARK'),
          // valuePrepareFunction: (value, dataRow) => {
          //   // console.log(dataRow)
          //   // return value
          // },
          // filterFunction(cell, search) {
          //   // if(cell == search){
          //   //   return cell;
          //   // }
          //   // console.log('cel', cell)
          // },
          width: "30%"
        },
        // use_yn:{

        // },
        creator: {
          filter: false,
          title: this.i18n.getTranslation('CREATED-BY'),
          editable: false,
          addable: false,
        },
        created_time: {
          filter: false,
          title: this.i18n.getTranslation('CREATED-DATE'),
          editable: false,
          addable: false,
        },
        use_yn: {
          class: 'text-center',
          filter: false,
          editable: false,
          title: this.i18n.getTranslation('USE-YN'),
          width: '4%',
          editor: {
            type: 'custom',
            component: UseynComponent,
          }
        }
      },
      actions: {
        columnTitle: this.i18n.getTranslation('ACTION'),
        add: true,
        edit: true,
        delete: true,
        position: 'right',
        width:''
      },
      attr: {
        class: 'table-bordered'
      },
    }
    this.initData(this.loggedUserInfo.company_id)
  }
  initData(company_id) {
    this.securityItemService.listSecurityItem(company_id).then(data => {
      this.listSecurityItem = data
      this.listSecurityItemShow = this.listSecurityItem.slice(0);
      this.source = new LocalDataSource(this.listSecurityItem)
      for (let item of this.listSecurityItemShow) {
        for (let item2 of this.listSharingItem) {
          if (item.security_item_id == item2['value'])
            item.security_item_id = item2['title']
        }
      }
      for (let item of this.listSecurityItemShow) {
        for (let item2 of this.listOpenType) {
          if (item.sharing_type == item2['value'])
            item.sharing_type = item2['title']
        }
      }
      for (let item of this.listSecurityItemShow) {
        switch (item.sharing_type) {
          case 'Sharing Group':
            for (let item3 of this.listGroup) {
              if (item.sharing_to_id == item3['sharing_group_id'])
                item.sharing_to_id = item3['sharing_group_nm']
            }
            break;
          case 'Sharing User':
            for (let item4 of this.listUser) {
              if (item.sharing_to_id == item4['user_id'])
                item.sharing_to_id = item4['user_nm']
            }
            break;
        }
      }
      for (let item of this.listSecurityItemShow) {
        if (item.use_yn == true) {
          item.use_yn = 'Yes'
        }
        else {
          item.use_yn = 'No'
        }
      }
      console.log('listSecurityItemShow', this.listSecurityItemShow)
    })
  }
  ngAfterViewInit(): void {
    // $('.ng2-smart-action-delete-delete').css('margin-left','5px')
    // console.log('ele ment',$('.ng2-smart-action-delete-delete'))
  }
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.systemMenuService.storeTemporaryModel(this.detailInfo);
    return true;
  }
  onSaveConfirm(value) {
    // console.log('value',value)
    let model = this.convertSecurityModel(value, 'data', 'newData')
    console.log('value', model)

    this.securityItemService.addOrUpdateSecurityItem(model).then(data => {
      // console.log(data)
      if (!data.success) {
        this.notification.showMessage("error", data.message);
        value.confirm.reject();
      } else {
        this.notification.showMessage("success", data.message);
        value.confirm.resolve(value.newData);
      }
    })
    // value.confirm.resolve(value.newData);
  }
  createConfirm(value) {
    let model = this.convertSecurityModel(value, 'newData', 'newData')
    model.company_id = this.loggedUserInfo.company_id
    this.securityItemService.addOrUpdateSecurityItem(model).then(data => {
      // console.log(data)
      if (!data.success) {
        this.notification.showMessage("error", data.message);
        value.confirm.reject();
      } else {
        this.notification.showMessage("success", data.message);
        this.initData(this.loggedUserInfo.company_id)
        this.source.load(this.listSecurityItemShow);

        value.confirm.resolve(value.newData);
      }
    })

    value.confirm.resolve(value.newData);

    // console.log(value)
  }
  onDeleteConfirm(value) {
    let model = this.convertSecurityModel(value, 'data', 'data')
    this.securityItemService.deleteSecurityItem(model).then(data => {
      // console.log(data)
      if (!data.success) {
        this.notification.showMessage("error", data.message);
        value.confirm.reject();
      } else {
        this.notification.showMessage("success", data.message);
        value.confirm.resolve(value.newData);
      }
    })
    value.confirm.resolve(value.data);
  }
  rowSelect(event) {
    // console.log(event)
    //  var a = $('.selected').find('td:first')
    // console.log(a)

    // var a = $('.selected').find('td')
    // .find('select')
    // console.log('event', event)

    // console.log('value', $('.selected').find('td:first').find('select').prop('ng-reflect-model'))

    // $('.selected').find('td:first').find('select option').each(function(){
    //   console.log($(this).val())
    // })

    // $('.selected').find('td:first').find('select').each(function () {
    //   console.log('value', $(this))
    // })
  }
  userRowSelect(value) {
    console.log(value)
  }

  convertSecurityModel(value, typeDataSecurity, typeData) {
    this.securityItemCRUD.company_id = value[typeData].company_id
    this.securityItemCRUD.trans_seq = value[typeData].trans_seq
    this.securityItemCRUD.remark = value[typeData].remark

    this.securityItemCRUD.changed_time = value[typeData].changed_time
    this.securityItemCRUD.created_time = value[typeData].created_time
    this.securityItemCRUD.changer = value[typeData].changer
    this.securityItemCRUD.creator = value[typeData].creator

    // console.log('value', this.listSharingItem)

    for (let item of this.listSharingItem) {
      if (item.title == value[typeDataSecurity].security_item_id)
        this.securityItemCRUD.security_item_id = item.value
    }
    for (let item of this.listOpenType) {
      if (item.title == value[typeData].sharing_type)
        this.securityItemCRUD.sharing_type = item.value
    }
    if (this.securityItemCRUD.sharing_type == 1) {
      for (let item of this.listGroup) {
        if (item.sharing_group_nm == value[typeData].sharing_to_id)
          this.securityItemCRUD.sharing_to_id = item.sharing_group_id
      }
    }
    if (this.securityItemCRUD.sharing_type == 2) {
      for (let item of this.listUser) {
        if (item.user_nm == value[typeData].sharing_to_id)
          this.securityItemCRUD.sharing_to_id = item.user_id
      }
    }
    if (value[typeData].use_yn == 'Yes') {
      this.securityItemCRUD.use_yn = 1
    }
    if (value[typeData].use_yn == 'No') {
      this.securityItemCRUD.use_yn = 0
    }
    return this.securityItemCRUD
  }

  generalInfo() {
    this.listSharingItem = [
      { value: 1, title: 'Sales Amount' },
      { value: 2, title: 'Order Amount' },
      { value: 3, title: 'Cost Order Amount' },
      { value: 4, title: 'Contract Amount' },
    ]
    this.listSharingItemShow = [
      { value: 'Sales Amount', title: 'Sales Amount' },
      { value: 'Order Amount', title: 'Order Amount' },
      { value: 'Cost Order Amount', title: 'Cost Order Amount' },
      { value: 'Contract Amount', title: 'Contract Amount' },
    ]
    this.listOpenType = [
      { value: 1, title: 'Sharing Group' },
      { value: 2, title: 'Sharing User' },
    ]
    this.listOpenTypeShow = [
      { value: 'Sharing Group', title: 'Sharing Group' },
      { value: 'Sharing User', title: 'Sharing User' },
    ]
    setTimeout(() => {
      for (let item of this.listGroup) {
        this.listOpenValue.push({ value: item.sharing_group_id, title: item.sharing_group_nm })
        this.listOpenValueShow.push({ value: item.sharing_group_nm, title: item.sharing_group_nm })
      }
      for (let item of this.listUser) {
        this.listOpenValue.push({ value: item.user_id, title: item.sharing_group_nm })
        this.listOpenValueShow.push({ value: item.user_nm, title: item.user_nm })
      }
      // console.log('Mer', this.listOpenValueShow)
    }, 700);

    // setTimeout(() => {
    //   // this.listOpenValueShow = this.listGroup.concat(this.listUser)
    //   for (let item of this.listGroup) {
    //     this.listOpenValueShow.push({ value: item.sharing_group_id, title: item.sharing_group_nm })
    //   }
    //   for (let item of this.listUser) {
    //     this.listOpenValueShow.push({ value: item.user_id, title: item.user_nm })
    //   }
    //   console.log('Mer', this.listOpenValueShow)
    // }, 500);

  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}

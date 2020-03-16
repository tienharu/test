import { Component, OnInit } from "@angular/core";
import { NotificationService } from "@app/core/services/notification.service";
import {
  AuthService,
  SystemMenuService,
  UserMasterService,
  OrganizationMasterService,
  ProgramService
} from "@app/core/services";
import { BasePage } from "@app/core/common/base-page";
import {
  SharingGroupModel,
  SharingGroupUserAddUpdateModel,
  SharingGroupMenuAddUpdateModel,
  SharingGroupMenuModel,
  SharingGroupUserModel
} from "@app/core/models/sharing-group.model";
import { SharingGroupService } from "@app/core/services/features.services/sharing-group.service";
import { NgForm } from "@angular/forms";
import { ProgramList } from "@app/core/common/static.enum";
import { I18nService } from "@app/shared/i18n/i18n.service";

@Component({
  selector: "sa-group-sharing-setting",
  templateUrl: "./group-sharing-setting.component.html",
  styleUrls: ["./group-sharing-setting.component.css"]
})
export class GroupSharingSettingComponent extends BasePage implements OnInit {
  detailInfo: SharingGroupModel;
  menuInfo: SharingGroupMenuModel;
  userInfo :SharingGroupUserModel;
  company: any = [];
  menus: any = [];
  users: any = [];
  usersFiltered: any = [];
  menuFiltered: any = [];
  usersbyOrg: any = [];
  orgs: any = [];
  options: any;
  optionsOfUsersTable: any;
  optionsOfMenuTable: any;
  validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      sharing_group_nm: {
        required: true
      },
    },
    // Messages for form validation
    messages: {
      sharing_group_nm: {
        required: "Please enter the sharing group name"
      },
    }
  };
  addedGroup: boolean = false;
  constructor(
    private notification: NotificationService,
    private menuService: SystemMenuService,
    private userMasterService: UserMasterService,
    public groupSharingService: SharingGroupService,
    public orgService: OrganizationMasterService,
    public programService: ProgramService,
    private i18nService: I18nService,
 

    public userService: AuthService
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Data_sharing_Group.valueOf())
    this.detailInfo = new SharingGroupModel();
    this.detailInfo.company_id = this.loggedUser.company_id;
    this.company.push(this.companyInfo);

    this.getSystemMenus().then(data => {
      this.menus.push(...data);
    });
    this.getUsers().then(data => {
      this.users.push(...data);
    });
    this.getOrg().then(data => {
      this.orgs.push(...data);
    });
    this.initDatatable();
    this.initGroupUsersTable();
    this.initGroupMenuTable();
  }
  private getSystemMenus() {
    return this.menuService.listMenuOfCompany(this.detailInfo.company_id);
  }
  private getUsers() {
    return this.userMasterService.listUsers();
  }
  private getOrg() {
    return this.orgService.listOrganization(this.detailInfo.company_id);
  }
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.groupSharingService
          .listSharingGroup(this.detailInfo.company_id)
          .then(data => {
            Promise.all([this.getSystemMenus]).then(res => {
              callback({
                aaData: data
              });
            });
          });
      },
      columns: [
        { data: "sharing_group_id", className: "center", width: "40px" },
        { data: "sharing_group_nm" },
        // {
        //   data: (data, type, dataToSet) => {
        //     var o = this.menus.filter(x => x.menu_id === data.menu_id);
        //     if (o.length > 0) return o[0].menu_name;
        //     else return "N/A";
        //   }
        // },
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center",
          width: "50px"
        },
        { data: "creator", className: "", width: "80px" },
        {
          data: "created_time",
          className: "center",
          width: "100px"
        },

      ],
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
            if(!this.permission.canDelete){
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.sharing_group_nm;
              this.notification.confirmDialog(
                "Delete Group Sharing Confirmation",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.groupSharingService
                      .deleteSharingGroup(rowSelected)
                      .then(data => {
                        if (data.error) {
                          this.notification.showMessage(
                            "error",
                            data.error.message
                          );
                        } else {
                          this.notification.showMessage(
                            "success",
                            "Deleted successfully"
                          );
                          this.onReset();
                          // this.reloadDatatable();
                          // this.reloadUsersTable();
                          // this.reloadMenuTable();
                          // this.detailInfo = new SharingGroupModel();
                          // this.detailInfo.company_id = this.loggedUser.company_id;
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
      ]
    };
  }

  private initGroupUsersTable() {
    this.optionsOfUsersTable = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.groupSharingService
          .listSharingGroupUsers(
            this.detailInfo.company_id,
            this.detailInfo.sharing_group_id,
          )
          .then(data => {
            var excludedUsser = [];
            data.forEach(e => {
              excludedUsser.push(e.user_id);
            });
            this.usersFiltered = this.users.filter(
              x => !excludedUsser.includes(x.user_id)
            );
            this.usersbyOrg = this.usersFiltered;
            callback({
              aaData: data
            });
          });
      },
      columns: [
        { data: "user_id", className: "center", width: "50px" },
        { data: "full_name", className: "" },
        {
          data: (data, type, dataToSet) => {
            var o = this.orgs.filter(x => x.org_cd === data.org_id);
            if (o.length > 0) return o[0].org_nm_eng;
            else return "N/A";
          }
        },
        { data: "created_time", className: "center", width: "100px" }
      ],
      //paging: false,
      //info: false,
      //scrollY:'auto',
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
            if (rowSelected) {
              this.notification.confirmDialog(
                "Delete Group Sharing User Confirmation",
                `Are you sure to remove ${rowSelected.full_name}?`,
                x => {
                  if (x) {
                    this.groupSharingService
                      .deleteSharingGroupUser(rowSelected)
                      .then(data => {
                        if (data.error) {
                          this.notification.showMessage("error", data.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            data.message
                          );
                          this.reloadUsersTable();
                        }
                      });
                  }
                }
              );
            }
          }
        },
        "csv",
        "pdf",
        "print"
      ]
    };
  }

  onRowClick(e) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    this.addedGroup = true;
    setTimeout(() => {
      this.detailInfo = e;
      this.reloadMenuTable();
      this.reloadUsersTable();
    }, 100);
  }

  onRowMenuClick(e) {
    this.addedGroup = true;
    setTimeout(() => {
      this.menuInfo = e;
     // this.reloadUsersTable();
    }, 100);
  }
  onSubmit() {
    this.groupSharingService.saveSharingGroup(this.detailInfo).then(data => {
      if (data.error) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.reloadDatatable();
        this.addedGroup = true;
        this.detailInfo = data.data;
      }
    });
  }
  onReset() {
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.detailInfo = new SharingGroupModel();
    this.detailInfo.company_id = this.loggedUser.company_id;
    this.reloadDatatable();
    this.addedGroup = false;
  }

  private reloadDatatable() {
    $(".tbl-sharing-group")
      .DataTable()
      .ajax.reload();
  }
  private reloadUsersTable() {
    $(".tbl-list-users")
      .DataTable()
      .ajax.reload();
  }

  private reloadMenuTable() {
    $(".tbl-list-menu")
      .DataTable()
      .ajax.reload();
  }
  filterUserByOrg(orgId) {
    if (orgId == null || orgId == "") {
      this.usersbyOrg = this.usersFiltered;
    } else {
      this.usersbyOrg = this.usersFiltered.filter(x => x.org_id == orgId);
    }
  }

  addUserToSharingGroup() {
    var userId = $("select[name='user_id']").val();
    if (userId == "undefined" || userId == "") {
      this.notification.showMessage("error", "Please select user");
      return;
    }
    var model = new SharingGroupUserAddUpdateModel();
    model.company_id = this.detailInfo.company_id;
    model.sharing_group_id = this.detailInfo.sharing_group_id;
    //model.menu_id = this.menuInfo.menu_id;
    model.user_id = [parseInt(userId)];
    model.use_yn = true;


    this.groupSharingService.saveSharingGroupUsers(model).then(data => {
      if (data.error) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.reloadUsersTable();
        $("select[name='user_id']")
          .val("")
          .trigger("change");
      }
    });
  }
  addAllUserToSharingGroup() {
    this.notification.confirmDialog(
      "Group Sharing - Add Users",
      `Are you sure to add all users to group [${
      this.detailInfo.sharing_group_nm
      }]?`,
      x => {
        if (x) {
          let userId = this.usersbyOrg.map(a => a.user_id);
          if (userId.length == 0) {
            this.notification.showMessage("error", "No user to add");
            return;
          }
          var model = new SharingGroupUserAddUpdateModel();
          model.company_id = this.detailInfo.company_id;
          model.sharing_group_id = this.detailInfo.sharing_group_id;
          //model.menu_id = this.detailInfo.menu_id;
          //model.menu_id = this.menuInfo.menu_id;
          model.user_id = userId;
          model.use_yn = true;
          this.groupSharingService.saveSharingGroupUsers(model).then(data => {
            if (data.error) {
              this.notification.showMessage("error", data.error.message);
            } else {
              this.notification.showMessage("success", data.message);
              this.reloadUsersTable();
            }
          });
        }
      }
    );
  }


  // Menu 
  private initGroupMenuTable() {
    this.optionsOfMenuTable = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.groupSharingService
          .listSharingGroupMenu(
            this.detailInfo.company_id,
            this.detailInfo.sharing_group_id
          )
          .then(data => {
            var excludedMenu = [];
            data.forEach(e => {
              excludedMenu.push(e.menu_id);
            });
            this.menuFiltered = this.menus.filter(
              x => !excludedMenu.includes(x.menu_id)
            );
            this.menus = this.menuFiltered;
            callback({
              aaData: data
            });
          });
      },
      columns: [
        { data: "menu_id", className: "center", width: "50px" },
        { data: "menu_name", className: "" },
        { data: "creator", className: "" },
        { data: "created_time", className: "center", width: "100px" }
      ],
      //paging: false,
      //info: false,
      //scrollY:'auto',
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
            if (rowSelected) {
              this.notification.confirmDialog(
                "Delete Group Sharing Menu Confirmation",
                `Are you sure to remove ${rowSelected.menu_name}?`,
                x => {
                  if (x) {
                    this.groupSharingService
                      .deleteSharingGroupMenu(rowSelected)
                      .then(data => {
                        if (data.error) {
                          this.notification.showMessage("error", data.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            data.message
                          );
                          this.reloadMenuTable();
                        }
                      });
                  }
                }
              );
            }
          }
        },
        "csv",
        "pdf",
        "print"
      ]
    };
  }

  addMenuToSharingGroup() {
    var menuId = $("select[name='menu_id']").val();
    if (menuId == "undefined" || menuId == "") {
      this.notification.showMessage("error", "Please select menu");
      return;
    }
    var model = new SharingGroupMenuAddUpdateModel();
    model.company_id = this.detailInfo.company_id;
    model.sharing_group_id = this.detailInfo.sharing_group_id;
    model.menu_id = [parseInt(menuId)];
    model.use_yn = true;

    this.groupSharingService.saveSharingGroupMenu(model).then(data => {
      if (data.error) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.reloadMenuTable();
        $("select[name='menu_id']")
          .val("")
          .trigger("change");
      }
    });
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}

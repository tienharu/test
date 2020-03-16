import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { CanDeactivateGuard } from "@app/core/guards/can-deactivate-guard";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "@app/core/services/notification.service";
import { SystemMenuService } from "@app/core/services/features.services/system-menu.service";
import { SystemMenuModel } from "@app/core/models/system-menu.model";
import { AuthService } from "@app/core/services/auth.service";
import { LoggedUserInfoModel } from "@app/core/models/logged-user-info.model";
import { ProgramService } from "@app/core/services";
import { BasePage } from "@app/core/common/base-page";
import { ProgramList } from "@app/core/common/static.enum";
import { I18nService } from "@app/shared/i18n/i18n.service";
import { CommonFunction } from "@app/core/common/common-function";

@Component({
  selector: "sa-system-menu",
  templateUrl: "./system-menu.component.html",
  styleUrls: ["./system-menu.component.css"]
})
export class SystemMenuComponent extends BasePage implements OnInit, CanDeactivateGuard {
  editLevelCheck: any = -1;
  options: any;
  detailInfo: SystemMenuModel;
  loggedUser: any = {};
  parentMenus: SystemMenuModel[] = [];
  fullParentMenus: SystemMenuModel[] = [];
 entryDate:any='';
 

  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private systemMenuService: SystemMenuService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService
  ) {
    super(userService);
  }



  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      menu_level: {
        required: true
      },
      menu_name: {
        required: true
      },
      // navi_nm: {
      //   required: true
      // },
      orderby_seq: {
        required: true
      },
      program_cd: {
        required: function(e) {
          return $("select[name='menu_level']").val() == "3";
        }
      },
      parent_menu_id: {
        required: function(e) {
          return (
            $("select[name='menu_level']").val() == "2" ||
            $("select[name='menu_level']").val() == "3"
          );
        }
      }
    },
    // Messages for form validation
    messages: {
      menu_level: {
        required: "Please select level"
      },
      menu_name: {
        required: "Please enter the menu name"
      },
      // navi_nm: {
      //   required: "Please enter the navigation name"
      // },
      orderby_seq: {
        required: "Please enter the order sequence"
      },
      program_cd: {
        required: "Please enter menu url"
      },
      parent_menu_id: {
        required: "Please select parent menu"
      }
    }
  };

  ngOnInit() {
    this.loggedUser = this.userService.getUserInfo();
    this.detailInfo = this.systemMenuService.getModel();
    this.detailInfo.creator=this.loggedUser.user_name;
    this.entryDate=new Date().toString('yyyy-MM-dd')
    this.initDatatable();
    this.checkPermission(ProgramList.System_menu.valueOf())
  }
  

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.api.get("/menu/hierarchy").subscribe(data => {
          callback({
            aaData: data.data
          });
        });
      },
      columns: [
        { data: "menu_id", className: "center", width: "8%" },
        {
          data: (data, type, dataToSet) => {
            if (data.menu_level == 1) return data.menu_name;
            let space = "";
            for (let i = 1; i < data.menu_level; i++) {
              space += "|----";
            }
            return space + data.menu_name;
          }, width: "20%"
        },
        //{ data: "parent_menu_id", className: "center", width: "70px" },
        { data: "menu_level", className: "center", width: "8%" },
        { data: "orderby_seq", className: "center", width: "8%" },
        { data: "program_cd",width: "20%" },
        { data: "mega_menu_nm", width: "8%" },
        // { data: "navi_nm" },
        { data: "mega_menu_help_text",width: "8%" },
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center", width: "20%"
        },
        
      ],
      scrollY: 553,
      scrollX: true,
      paging: false,

      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            this.onReset();
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
              var selectedText: string = rowSelected.menu_name;
              this.notification.confirmDialog(
                "Delete System-menu Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.api
                      .post("/menu/delete", rowSelected)
                      .subscribe(data => {
                        if (data.error) {
                          this.notification.showMessage("error", data.error.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            data.data.message
                          );
                          this.onReset();
                        }
                      });
                  }
                }
              );
            }
          }
        },
        "copy",
        "excel",
        "pdf",
        "print"
      ]
    };
  }

  onRowClick(event) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    var curLevel=$("select[name='menu_level']").val();
    if (event.menu_level != curLevel) {
      //get parent
      this.getParentMenus(event.menu_level).then(data => {
        this.fullParentMenus = data;
        this.parentMenus = this.fullParentMenus.filter(p => p.menu_id !== this.detailInfo.menu_id);
        setTimeout(() => {
          this.detailInfo = event;
          this.entryDate = CommonFunction.getDateFromDatetime(this.detailInfo.created_time)
        }, 100);
      });
    } else {
      setTimeout(() => {
        this.detailInfo = event;
        this.entryDate = CommonFunction.getDateFromDatetime(this.detailInfo.created_time)
      }, 100);
    }
    // this.api.get(`/menu/details/${event.menu_id}`).subscribe(data => {

    // });
    
  }

  onLevelSelectedChange(level) {
    this.detailInfo.menu_level = level;
    this.getParentMenus(level).then(data => {
      this.fullParentMenus = data;
      this.parentMenus = this.fullParentMenus.filter(p => p.menu_id !== this.detailInfo.menu_id);
    });

    switch (level) {
      case "1":
        $("input[name='program_cd']").removeClass("required");
        $("select[name='parent_menu_id']").removeClass("required");
        break;
      case "2":
        $("input[name='program_cd']").removeClass("required");
        $("select[name='parent_menu_id']").addClass("required");
        break;
      case "3":
        $("input[name='program_cd']").addClass("required");
        $("select[name='parent_menu_id']").addClass("required");
        break;
    }
  }

  private getParentMenus(level) {
    return new Promise<SystemMenuModel[]>((resolve, reject) => {
      this.api.get(`/menu/level/${level}`).subscribe(data => {
        resolve(data.data);
      });
    });
  }

  onSubmit() {
    var f = $("form.frm-detail").validate();
    if (Object.keys(f.invalid).length !== 0) {
      return;
    }
  
    if (this.detailInfo.parent_menu_id == null) {
      this.detailInfo.parent_menu_id = "0";
    }

    if (this.detailInfo.menu_id === 0) {
      this.api.post("menu/insert", this.detailInfo).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
        }
      });
    } else {
      this.api.post("menu/update", this.detailInfo).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
        }
      });
    }
  }

  onReset() {
    this.reloadDatatable();
    $("form.frm-detail")
      .validate()
      .resetForm();

    this.systemMenuService.resetModel();
    this.detailInfo = this.systemMenuService.getModel();
    this.detailInfo.creator=this.loggedUser.user_name;
    this.entryDate=new Date().toString('yyyy-MM-dd')
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.systemMenuService.storeTemporaryModel(this.detailInfo);
    return true;
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}

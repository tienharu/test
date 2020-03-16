import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/core/services/notification.service';
import { HrRewardPunishInfoService } from '@app/core/services/hr.services/hr-reward-punish.service';
import { HrRewardPunishModel } from '@app/core/models/hr/hr-reward-punish.model';
import { BasePage } from '@app/core/common/base-page';
import { AuthService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { ProgramList } from '@app/core/common/static.enum';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'sa-reward-punish',
  templateUrl: './reward-punish.component.html',
  styleUrls: ['../../main-info/main-info2.component.css']
})
export class HRRewardPunishComponent extends BasePage implements OnInit {

  rewardPunish: HrRewardPunishModel;
  options: any;
  companyId: number = 0;
  hrId: string = '';
  hrIdBK : string = '';
  constructor(
    private notification: NotificationService,
    private hrRewardPunishInfoService: HrRewardPunishInfoService,
    public userService: AuthService,
    private i18nService:I18nService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    super(userService);
  }
  
  ngOnInit() {
    this.checkPermission(ProgramList.Personal_Info_Master.valueOf());
    this.rewardPunish = this.hrRewardPunishInfoService.getModel()
    this.initDatatable();
    $('.reward-from-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.rewardPunish.from_ymd = selectedDate;
      }
    });
    $('.reward-to-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.rewardPunish.to_ymd = selectedDate;
      }
    });
  }
  getDataFromMain(companyID: number, hrID: string) {
    if (this.companyId === 0) {
      this.companyId = companyID;
      this.hrId = this.hrIdBK = hrID;
      this.onReset();
    }
    else{
      this.hrId = hrID;
    }

    if (this.hrIdBK !== hrID) {
      this.hrId = this.hrIdBK = hrID;
      this.onReset();
    }
  }
  resetData(){
    this.hrRewardPunishInfoService.resetModel();
    this.rewardPunish = this.hrRewardPunishInfoService.getModel();
    $(".eplRewardInfoList").DataTable().clear().draw();
  }
  //validate
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      from_ymd: {
        required: true
      },
      reward_punish_type: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      from_ymd: {
        required: "Please enter"
      },
      reward_punish_type: {
        required: "Please enter "
      }
    }
  };
  //
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrRewardPunishInfoService.listRewardPunish(this.companyId, this.hrId).then(data => {
          callback({
            aaData: data
          });

        })
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            if (data.reward_punish_type == 1) return 'Reward';
            else return "Punish";
          }, className: "", width: "100px"
        },
        { data: "from_ymd", className: "center", width: "100px" },
        { data: "to_ymd", className: "center", width: "100px" },
        { data: "issued_by", className: "", width: "100px" },
        { data: "reward_punish_reason", className: "", width: "auto" }
      ],
      //scrollY: 210,
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
          text: '<i class="fa fa-trash text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if(!this.permission.canDelete){
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.reward_punish_type;
              this.notification.confirmDialog(
                "Delete Employee Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrRewardPunishInfoService.DeleteHrRewardPunishInfo(this.rewardPunish).then(data => {
                      if (data.error) {
                        this.notification.showMessage("error", data.error.message);
                      } else {
                        this.notification.showMessage(
                          "success",
                          data.message
                        );
                        this.onReset();
                      }
                    })
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
  //
  onRowClick(event) {
    setTimeout(() => {
      this.rewardPunish = event;
    }, 100);
    var f = $("form.frmRewardPunish").validate();
    if (!f.valid()) {
      f.resetForm();
    }

  }
  //
  onSubmit() {
    this.hrRewardPunishInfoService.insertHrRewardPunishInfo(this.rewardPunish).then(data => {
      if (data.error) {
        if (data.error.code === 403) {
          this.modalService.hide(1);
          this.router.navigate(["/error/error403"]);
        }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.onReset();
      }
    })
  }
  onReset() {
    $("form.frmRewardPunish")
      .validate()
      .resetForm();
    this.hrRewardPunishInfoService.resetModel();
    this.rewardPunish = this.hrRewardPunishInfoService.getModel();
    //
    this.rewardPunish.company_id = this.companyId;
    this.rewardPunish.hr_id = this.hrId;

    this.reloadDatatable();
  }

  private reloadDatatable() {
    $(".eplRewardInfoList")
      .DataTable()
      .ajax.reload();
  }
}

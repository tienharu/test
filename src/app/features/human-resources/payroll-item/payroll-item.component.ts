import { Component, OnInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { NotificationService, AuthService, CanDeactivateGuard, ProgramService } from '@app/core/services';
import { PayrollItemService } from '@app/core/services/hr.services/hr-payroll-item.service';
import { PayrollItemModel } from '@app/core/models/hr/hr-payroll-item.model';
import { Observable } from 'rxjs';
import { ProgramList } from '@app/core/common/static.enum';

@Component({
    selector: 'hr-payroll-item',
    templateUrl: './payroll-item.component.html',
    styleUrls: [],
})

export class PayrollItemComponent extends BasePage implements OnInit, CanDeactivateGuard {
    options: any;
    payrollitem: PayrollItemModel;
    isSBTDisable: boolean = true;
    mappingItems:any[] = [];
    sbtCol:any[] = [
        { id: 10, text: "BASIC"},
        { id: 1, text: "SBT_1"},
        { id: 2, text: "SBT_2"},
        { id: 3, text: "SBT_3"},
        { id: 4, text: "SBT_4"},
        { id: 5, text: "SBT_5"},
        { id: 6, text: "SBT_6"},
        { id: 7, text: "SBT_7"},
        { id: 8, text: "SBT_8"},
        { id: 9, text: "SBT_9"}
    ];

    constructor(
        public i18n: I18nService,
        private notification: NotificationService,
        public userService: AuthService,
        public programService: ProgramService,
        public payrollItemService: PayrollItemService) {
        super(userService);
        this.payrollitem = payrollItemService.getModel();
    }

    public validationOptions: any = {
        ignore: [], //enable hidden validate
        // Rules for form validation
        rules: {
            payroll_item_name: {
            required: true
          }
        },
        // Messages for form validation
        messages: {
            payroll_item_name: {
            required: this.i18n.getTranslation('PAYROLL_ITEM_MSG_NAME_REQUIRED')
          }
        }
      };

    ngOnInit() {
        this.payrollItemService.getMappingPayrollItems().then(d => {
            this.mappingItems = d.data;
          });
        this.checkPermission(ProgramList.Payroll_Item_Setting.valueOf());
        this.initDatatable();
    }

    private initDatatable() {
        this.options = {
            dom: "Bfrtip",
            ajax: (data, callback, settings) => {
                this.payrollItemService.getPayrollItems().then(data => {
                    callback({
                        aaData: data.data
                    });
                })
            },
            columns: [
                { 
                    data: "payroll_item_id", className: "center", width: "50px" 
                },
                {
                    data: "payroll_item_name", className: "", width: "200px" 
                },
                {
                    data: "order_seq", className: "center", width: "40px" 
                },
                {
                    data: (data, type, dataToSet) => {
                        return data.insurance_yn ? "Yes" : "No";
                    },
                    className: "center"
                },
                {
                    data: (data, type, dataToSet) => {
                        return data.tax_yn ? "Yes" : "No";
                    },
                    className: "center"
                },
                {
                    data: (data, type, dataToSet) => {
                        return data.add_deduct_type ? "Yes" : "No";
                    }, className: "center" 
                },
                {
                    data: (data, type, dataToSet) => {
                        return data.sbt_yn ? "Yes" : "No";
                    },
                    className: "center"
                },
                {
                    data: (data, type, dataToSet) => {
                        let result = this.sbtCol.filter(e => e.id == data.sbt_column_seq);
                        if(result && result[0])
                        {
                            return result[0].text;
                        }
                        else{
                            return "";
                        }
                    },
                    className: ""
                },
                {
                    data: (data, type, dataToSet) => {
                        return data.use_yn ? "Yes" : "No";
                    },
                    className: "center"
                },
                
                { 
                    data: "creator", className: "" 
                },
                { 
                    data: "created_time", className: "center"
                },
                {
                    data: (data, type, dataToSet) => {
                        return data.remark; 
                    }, className: "wrap-text", width: "auto"
                },
            ],
            //scrollY: 210,
            scrollX: true,
            paging: true,
            pageLength: 25,
            buttons: [
                {
                    text: '<i class="fa fa-refresh" title="Refresh"></i>',
                    action: (e, dt, node, config) => {
                        dt.ajax.reload();
                        this.payrollitem = new PayrollItemModel();
                    }
                },
                {
                    extend: "selected",
                    text: '<i class="fa fa-trash-o" title="Delete"></i>',
                    action: (e, dt, button, config) => {
                        if(!this.permission.canDelete){
                            this.notification.showMessage("error", this.i18n.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
                            return;
                          }
                        var rowSelected = dt.row({ selected: true }).data();
                        if (rowSelected) {
                            var selectedText: string = rowSelected.payroll_item_name;
                            this.notification.confirmDialog(
                                this.i18n.getTranslation('PAYROLL_ITEM_CONFIRM'),
                                this.i18n.getTranslation('PAYROLL_ITEM_CONFIRM_DELETE') + ` ${selectedText}?`,
                                x => {
                                    if (x) {
                                        this.payrollItemService.delete(this.payrollitem).then(data => {
                                          if (data.error) {
                                            this.notification.showMessage("error", data.error.message);
                                          } else {
                                            this.notification.showMessage(
                                              "success",
                                              data.message
                                            );
                                            this.reloadDatatable();
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

    onRowClick(event) {
        var f = $("form.frm-detail").validate();
        if (!f.valid()) {
          f.resetForm();
        }
        this.payrollitem = event;
        if(!this.payrollitem.sbt_column_seq_temp)
        {
            this.payrollitem.sbt_column_seq_temp = event.sbt_column_seq;
        }
        if(this.payrollitem.sbt_column_seq_temp != this.payrollitem.sbt_column_seq)
        {
            this.payrollitem.sbt_column_seq = this.payrollitem.sbt_column_seq_temp;
        }
        this.useSBT();
    }

    onSubmit() {
        this.payrollitem.company_id = this.companyInfo.company_id;
        if(this.payrollitem.order_seq < 1)
        {
            this.notification.showMessage("error", this.i18n.getTranslation('PAYROLL_ITEM_MSG_SEQ_REQUIRED'));
            return;
        }
        if(this.payrollitem.sbt_yn && this.payrollitem.sbt_column_seq == null)
        {
            this.notification.showMessage("error", this.i18n.getTranslation('PAYROLL_ITEM_MSG_SBT_SEQ_REQUIRED'));
            return;
        }
        this.payrollItemService.savePayrollItems(this.payrollitem).then(data => {
            if (data.error) {
                if(data.error.message == "existed")
                {
                    this.notification.showMessage("error", this.i18n.getTranslation("EXISTED"));
                }
                else
                {
                    this.notification.showMessage("error", data.error.message);
                }
            } else {
                this.notification.showMessage("success", data.message);
                this.reloadDatatable();
            }
        });
    }

    onReset() {
        $("form.frm-detail").validate().resetForm();
        this.payrollItemService.resetModel();
        this.payrollitem = this.payrollItemService.getModel();
        this.payrollitem.company_id = this.companyInfo.company_id;
        this.reloadDatatable();
    }

    private reloadDatatable() {
        $(".traderListInfo")
            .DataTable()
            .ajax.reload();
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        this.payrollItemService.storeTemporaryModel(this.payrollitem);
        return true;
    }

    useSBT(){
        if(!this.payrollitem.sbt_yn)
        {
            this.isSBTDisable = true;
            this.payrollitem.sbt_column_seq = null;
        }
        else
        {
            this.isSBTDisable = false;
        }
    }

    onCloseProgram(){
        this.programService.closeCurrentProgram();
    }
}
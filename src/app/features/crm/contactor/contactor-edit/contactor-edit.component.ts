import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { NgForm } from "@angular/forms";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "@app/core/services/notification.service";
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { AuthService, UserMasterService, CanDeactivateGuard } from '@app/core/services';
import { ContactorModel } from '@app/core/models/contactor.model';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { BasePage } from '@app/core/common/base-page';
import { UserModel } from '@app/core/models/user.model';
import { Observable } from 'rxjs';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { TraderModel } from '@app/core/models/trader.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: 'sa-contactor-edit',
    templateUrl: './contactor-edit.component.html',
})

export class ContactorEditComponent extends BasePage implements OnInit, CanDeactivateGuard {
    traderCate: GeneralMasterModel[] = [];
    contactorTypeGen: GeneralMasterModel[] = [];
    Level: GeneralMasterModel[] = [];
    Rule: GeneralMasterModel[] = [];
    user: UserModel[] = [];
    companies: any = [];
    contactorInfo: ContactorModel;
    traderLocalName: TraderModel[] = [];
    @Input() contactorId: number;
    @Input() contactorJson: string;
    @Output() childCall = new EventEmitter();
    modalRef: BsModalRef;

    constructor(private api: CRMSolutionApiService,
        private notification: NotificationService,
        private contactorService: ContactorService,
        public userService: AuthService,
        public userMasterService: UserMasterService,
        private traderService: TraderService,
        private modalService: BsModalService,
        private router: Router,
        private generalMasterService: GeneralMasterService) {
        super(userService);
    }
    ngOnInit() {
        this.checkPermission(ProgramList.Contactor_Magt.valueOf());
        this.contactorInfo = JSON.parse(this.contactorJson);
        this.contactorInfo.company_id = this.companyInfo.company_id;
        this.companies.push(this.companyInfo);

        this.getContactorType().then(data => {
            this.contactorTypeGen.push(...data);
        });

        this.getLevelType().then(data => {
            this.Level.push(...data);
        });

        this.getRuleType().then(data => {
            this.Rule.push(...data);
        });

        this.GetUser().then(data => {
            this.user.push(...data);
        });

        this.GetTrader().then(data => {
            this.traderLocalName.push(...data);
        });
    }

    public validationOptions: any = {
        ignore: [], //enable hidden validate
        // Rules for form validation
        rules: {
            trader_id: {
                required: true
            },
            contactor_nm: {
                required: true
            },
            contactor_type_gen_cd: {
                required: true
            },
            rule_gen_cd: {
                required: true
            },
            am_id: {
                required: true
            },
        },
        // Messages for form validation
        messages: {
            trader_id: {
                required: "Please select"
            },
            contactor_nm: {
                required: "Input contactor name"
            },
            contactor_type_gen_cd: {
                required: "Please select type"
            },
            rule_gen_cd: {
                required: "Please select user"
            },
            am_id: {
                required: "Please select user"
            },
        }
    };

    private getContactorType() {
        return this.generalMasterService.listGeneralByCate(Category.ContactorType.valueOf())
    }

    private getLevelType() {
        return this.generalMasterService.listGeneralByCate(Category.ContactorLevel.valueOf())
    }

    private getRuleType() {
        return this.generalMasterService.listGeneralByCate(Category.ContactorRule.valueOf())
    }

    private GetUser() {
        return this.userMasterService.listUsers();
    }

    private GetTrader() {
        return this.traderService.ListTrader(this.companyInfo.company_id);
    }

    onSubmit() {
        this.contactorService.InsertContactor(this.contactorInfo).then(data => {
            if (data.error) {
                if (data.error.code === 403) {
                    this.modalService.hide(1);
                    this.router.navigate(["/error/error403"]);
                  }
                this.notification.showMessage("error", data.error.message);
            } else {
                this.notification.showMessage("success", data.message);
                this.modalService.hide(1);
                this.childCall.emit();
            }
        });
    }


    onReset() {
        $("form.frm-detail")
            .validate()
            .resetForm();
        this.contactorService.resetModel();
        this.contactorInfo = this.contactorService.getModel();
        this.contactorInfo.company_id = this.companyInfo.company_id;
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        return true;
    }

    sharingToSelected(data) {
        this.contactorInfo.sharing_to = data;
        console.log('sharingToSelected', this.contactorInfo.sharing_to)
    }
    onClose() {
        this.modalService.hide(1);
    }
    onDelete() {
        this.notification.confirmDialog(
            "Deleting this item ?",
            `Deleting an item will move it to the <span class='warning-emphasize'>trash</span>.<br />
            Deleted items <span class='warning-emphasize'>can</span> be <span class='warning-emphasize'>recovered from the Recycle Bin within 30 days</span>.<br />
            Do you want to continue?`,
            x => {
                if (x) {
                    this.contactorService.DeleteContractor(this.contactorInfo).then(data => {
                        if (data.error) {
                            if (data.error.code === 403) {
                                this.modalService.hide(1);
                                this.router.navigate(["/error/error403"]);
                              }
                            this.notification.showMessage("error", data.error.message);
                        } else {
                            this.notification.showMessage("success", data.message);
                            this.modalService.hide(1);
                            this.router.navigate(['/crm-contactor']);
                        }
                    })
                }
            }
        );
    }
}
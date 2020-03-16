import { Component, OnInit, Input, ViewChild } from "@angular/core";
import {
  CRMSolutionApiService,
  NotificationService,
  AuthService,
} from "@app/core/services";
import { BsModalService } from "ngx-bootstrap";
import { NgForm } from "@angular/forms";
import { CompanyContractModel } from "@app/core/models/company-contract.model";
import { PackageModel } from "@app/core/models/package.model";
import { BasePage } from "@app/core/common/base-page";

@Component({
  selector: "sa-edit-contract",
  templateUrl: "./edit-contract.component.html"
})
export class EditContractComponent extends BasePage implements OnInit {
  @Input()
  companyId: any;
  @Input()
  packId: any;
  @Input()
  detailInfoJson: any;
  detailInfo: CompanyContractModel;
  packages: PackageModel[] = [];
  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private modalService: BsModalService,
    public userService: AuthService


  ) {super(userService);}
  validationOptions: any={

  }
  
  private getPackages() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/package/list/`).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
          data.data = [];
        }
        resolve(data.data);
      });
    });
  }
  ngOnInit(): void {
    this.initModel();
    this.getPackages().then(data => {
      this.packages.push(...data);
    });
  }
  initModel() {
    if (this.detailInfoJson) {
      this.detailInfo = JSON.parse(this.detailInfoJson);
    } else {
      this.detailInfo = new CompanyContractModel();
    }
    
    this.detailInfo.company_id = this.companyId;
    this.detailInfo.pack_id = this.packId;
    console.log('companycontract',this.detailInfo)
  }
  onSubmit() {
    console.log(`Submitting ${JSON.stringify(this.detailInfo)}`);
    if (this.detailInfo.company_seq === 0) {
      this.api
        .post("companycontract/insert", this.detailInfo)
        .subscribe(data => {
          if (!data.success) {
            this.notification.showMessage("error", data.data.message);
          } else {
            this.notification.showMessage("success", data.data.message);
            this.modalService._hideModal(2);
            $(".tbl-company-contract").DataTable().ajax.reload();
          }
        });
    } else {
      this.api
        .post("companycontract/update", this.detailInfo)
        .subscribe(data => {
          if (!data.success) {
            this.notification.showMessage("error", data.data.message);
          } else {
            this.notification.showMessage("success", data.data.message);
            this.modalService._hideModal(2);
            $(".tbl-company-contract").DataTable().ajax.reload();
          }
        });
    }
  }
  onReset(f: NgForm) {
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.initModel();
  }

  onFileChange(e) {
    if (e.target.files.length > 0) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.detailInfo.attach_document_data = {
          file_name: file.name,
          file_type: file.type,
          value: reader.result.toString()
        };
      };
    } else {
      this.detailInfo.attach_document_data = null;
    }
  }
}

import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { CRMSolutionApiService, NotificationService } from "@app/core/services";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { CompanyContractModel } from "@app/core/models/company-contract.model";
import { PackageModel } from "@app/core/models/package.model";

@Component({
  selector: "sa-company-contract",
  templateUrl: "./company-contract.component.html"
})
export class CompanyContractComponent implements OnInit {
  @ViewChild("tplContractEdit")  tplContractEdit;
  modalRef: BsModalRef;
  @Input()  companyId: any;
  packId:number=0;
  options: any;
  contractDetail:CompanyContractModel;
  packages: PackageModel[] = [];
  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getPackages().then(data => {
      this.packages.push(...data);
    });
    this.initDatatable();
  }
  private getPackages() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/package/list/`).subscribe(data => {
        if (!data.success) {
          data.data = [];
        }
        resolve(data.data);
      });
    });
  }
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.api.get("/companycontract/details/"+this.companyId).subscribe(data => {
          console.log(data);
          callback({
            aaData: data.data
          });
        });
      },
      columns: [
        { data: "contract_no",className: "center" },
        { data: "contract_name" },
        { data: "contract_date", className: "center" },
        {
          data: (data, type, dataToSet) => {
            var pkg= this.packages.filter(x=>x.pack_id==data.pack_id);
            if(pkg.length>0){
              return pkg[0].pack_nm;
            }
            return 'N/A'
          },
          className: ""
        },
        { data: "payment_ymd", className: "center" },
        { data: "payment_money_amount", className: "right"},
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center"
        },
        { data: "changer", className: "center" },
        {
          data: "changed_time",
          className: "center"
        }
      ],
      paging: false,
      scrollY:400,
      buttons: [
        {
          text: '<i class="fa fa-plus text-primary" title="New Contract"></i>',
          action: (e, dt, node, config) => {
            this.contractDetail = new CompanyContractModel();
            this.openContractEditPopup()
          }
        },
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
              var selectedText: string = rowSelected.pack_id;
              this.notification.confirmDialog(
                "Delete company contract confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.api
                      .post("/companycontract/delete", rowSelected)
                      .subscribe(data => {
                        if (!data.success) {
                          this.notification.showMessage("error", data.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            "Deleted successfully"
                          );
                          this.reloadDatatable();
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
  private reloadDatatable() {
    $(".tbl-company-contract")
      .DataTable()
      .ajax.reload();
  }
  onContractRowClick(event){
    this.packId=event.pack_id?event.pack_id:0
    setTimeout(() => {
      this.contractDetail=event;
      this.openContractEditPopup()
    }, 100);
  }

  openContractEditPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.tplContractEdit, config);
  }
  closeEditContract() {
    this.modalRef && this.modalRef.hide();
    this.reloadDatatable() ;
  }
}

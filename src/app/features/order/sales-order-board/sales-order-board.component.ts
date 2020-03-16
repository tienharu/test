import { Component, OnInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { CategoryModel } from '@app/core/models/category.model';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { NameValueModel } from '@app/core/models/name-value.model';

@Component({
  selector: 'sa-sales-order-board',
  templateUrl: './sales-order-board.component.html',
  styleUrls: ['./sales-order-board.component.css']
})
export class SalesOrderBoardComponent extends BasePage implements OnInit {
  cate_cd: number;
  Categories: CategoryModel[] = [];
  parents: GeneralMasterModel[] = [];
  detailInfo: GeneralMasterModel;
  options: any;
  cateId: any;
  isFilterGrid: boolean = true;
  currentTypes: NameValueModel[] = [
    {
      name: "CURRENT",
      value: 1
    }
  ];

  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,

    private generalMasterService: GeneralMasterService) {
    super(userService);
    this.cate_cd = Category.OrgCateCode;
  }


  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      cate_cd: {
        required: true
      },
      general_nm: {
        required: true
      },
    },
    // Messages for form validation
    messages: {
      cate_cd: {
        required: "Please select the category"
      },
      general_nm: {
        required: "Please enter the general name"
      },
    }
  };

  ngOnInit() {
    // this.checkPermission(ProgramList.General_Sys_Master.valueOf())
    this.detailInfo = new GeneralMasterModel();//this.organizationMasterService.getModel();

    this.getCategories().then(data => {
      this.Categories.push(...data);
    });

    this.initDatatable();
  }

  // ngAfterViewInit() {
  //   $('b[role="presentation"]').hide();
  //   $('.select2-selection__arrow').append('<i class="fa fa-angle-down" style="select2-selection__arrow"></i>');
  // }

  private getCategories() {
    return this.generalMasterService.listGeneralCategory();
  }

  private getParents(value) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`sysgeneral/details/catecd/${value}`).subscribe(data => {
        resolve(data.data);
      });
    });
  }

  onGetParent(value, event) {
    this.getParents(value).then(data => {
      this.parents.push(...data);
    }).then(() => {
      this.detailInfo = event;
    })
  }
  onCateChange(cateId) {
    if (this.isFilterGrid)
      $('select[name="filter_cate_cd"]').val(cateId).trigger('change');
  }
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        // this.generalMasterService.listSystemGeneral().then(data => {
        //   callback({
        //     aaData: data
        //   });
        // });
        callback({
          aaData: []
        });
      },
      columns: [
        { data: "ck_value_3", width: "58px", className: "center" },
        { data: "ck_value_3", width: "96px", className: "center" },
        { data: "ck_value_3", width: "80px", className: "center" },
        { data: "ck_value_3", width: "78px", className: "center" },
        { data: "ck_value_3", width: "109px", className: "center" },
        { data: "ck_value_3", width: "104px", className: "center" },
        { data: "ck_value_3", width: "93px", className: "center" },
        { data: "ck_value_3", width: "67px", className: "center" },
        { data: "ck_value_3", width: "61px", className: "center" },
        { data: "ck_value_3", width: "89px", className: "center" },
        { data: "ck_value_3", width: "103px", className: "center" },
        { data: "ck_value_3", width: "68px", className: "center" },
        { data: "ck_value_3", width: "79px", className: "center" },
        { data: "ck_value_3", width: "93px", className: "center" },
        { data: "ck_value_3", width: "95px", className: "center" },
        { data: "ck_value_3", width: "96px", className: "center" },
        { data: "ck_value_3", width: "74px", className: "center" },
        { data: "ck_value_3", width: "85px", className: "center" },
        { data: "ck_value_3", width: "125px", className: "center" }
      ],
      pageLength: 25,
      scrollX: true,
      // scrollY: 350,
      // paging: false,
      buttons: [
        // {
        //   text: '<i class="fa fa-refresh" title="Refresh"></i>',
        //   action: (e, dt, node, config) => {
        //     dt.ajax.reload();
        //     this.detailInfo = new GeneralMasterModel();
        //   }
        // },
        // "copy",
        // "excel",
        // "pdf",
        // "print"
      ]
    };
  }

  onRowClick(event) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    this.isFilterGrid = false;
    let value = event.cate_cd;
    //this.onGetParent(value,event);     
    setTimeout(() => {
      this.detailInfo = event;
    }, 10);

    setTimeout(() => {
      this.isFilterGrid = true;
    }, 200);

  }

  onSubmit() {
    this.detailInfo.cate_cd = $('.cate_cd').val();
    this.detailInfo.parent_cd = $('.parent_cd').val();
    if (this.detailInfo.gen_cd == undefined) {
      this.detailInfo.gen_cd = '0';
    }

    // console.log(`Submitting ${JSON.stringify(this.detailInfo)}`);
    if (this.detailInfo.gen_cd === '0') {
      this.generalMasterService.insertSystemGeneralInfo(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();

          let currentCateCd = this.detailInfo.cate_cd;
          this.detailInfo = new GeneralMasterModel();
          this.detailInfo.cate_cd = currentCateCd;
        }
      });
    } else {
      this.generalMasterService.updateSystemGeneralInfo(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
        }
      });
    }
  }

  onReset(f: NgForm) {
    this.isFilterGrid = true;
    this.reloadDatatable();
    $("form.frm-detail")
      .validate()
      .resetForm();

    this.detailInfo = new GeneralMasterModel();
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    //this.organizationMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }
  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

}
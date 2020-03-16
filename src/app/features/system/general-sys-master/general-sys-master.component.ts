import { Component, OnInit } from '@angular/core';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { NgForm } from "@angular/forms";
import { Observable } from 'rxjs';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { CategoryModel } from '@app/core/models/category.model';

import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { ProgramService, AuthService } from '@app/core/services';
import { BasePage } from '@app/core/common/base-page';

@Component({
  selector: 'sa-general-sys-master',
  templateUrl: './general-sys-master.component.html',
  styleUrls: ['./general-sys-master.component.css']
})

export class GeneralSysMasterComponent extends BasePage implements OnInit {
  cate_cd: number;
  Categories: CategoryModel[] = [];
  parents: GeneralMasterModel[] = [];
  detailInfo: GeneralMasterModel;
  options: any;
  cateId:any;
  isFilterGrid:boolean=true;

  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,

    private generalMasterService: GeneralMasterService
  ) {
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
    this.checkPermission(ProgramList.General_Sys_Master.valueOf())
    this.detailInfo = new GeneralMasterModel();//this.organizationMasterService.getModel();

    this.getCategories().then(data => {      
        this.Categories.push(...data); 
    });

    this.initDatatable();   
  }

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

  onGetParent(value,event) {
    this.getParents(value).then(data => {
        this.parents.push(...data);        
    }).then(()=>{
       this.detailInfo = event;
    })
  }
  onCateChange(cateId){
    if(this.isFilterGrid)
      $('select[name="filter_cate_cd"]').val(cateId).trigger('change');
  }
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.generalMasterService.listSystemGeneral().then(data => {
          callback({
            aaData: data
          });
        });
      },
      columns: [
        { data: "gen_cd",class:"center word-wrap",width:"80px" },
        {
          data: (data, type, dataToSet) => {
            var c = this.Categories.filter(
              x => x.cate_cd === data.cate_cd
            );
            if (c.length > 0) return c[0].cate_nm;
            else return "N/A";
          },
          className: "word-wrap"
          ,width:"120px"
        },
        { data: "gen_nm",width:"200px",className: "word-wrap" },
        { data: "parent_cd",width:"80px", className: "word-wrap" },
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center word-wrap",width:"50px"
        },
        { data: "number_value_1",width:"100px",className: "center word-wrap" },
        { data: "number_value_2",width:"100px",className: "center word-wrap" },
        { data: "number_value_3",width:"100px",className: "center word-wrap" },
        { data: "seq_value_1",width:"40px",className: "center word-wrap" },
        { data: "seq_value_2",width:"40px",className: "center word-wrap" },
        { data: "seq_value_3",width:"40px",className: "center word-wrap" },
        { data: "ck_value_1",width:"40px",className: "center word-wrap" },
        { data: "ck_value_2",width:"40px",className: "center word-wrap" },
        { data: "ck_value_3",width:"40px",className: "center word-wrap" },
        { data: "text_value_1",width:"120px",className: "word-wrap" },
        { data: "text_value_2",width:"120px",className: "word-wrap" },
        { data: "text_value_3",width:"120px",className: "word-wrap" },
        {
          data: (data, type, dataToSet) => {
            return data.sys_cd_yn ? "Yes" : "No";
          },
          className: "center word-wrap",width:"50px"
        },
        { data: "remark", className: "word-wrap",width:"250px" }
      ],
      pageLength:25,
      scrollX:true,
      // scrollY: 350,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.detailInfo = new GeneralMasterModel();
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
    this.isFilterGrid=false;
    let value = event.cate_cd;
    //this.onGetParent(value,event);     
    setTimeout(() => {
      this.detailInfo = event;
    }, 10);

    setTimeout(() => {
      this.isFilterGrid=true;
    }, 200);

  }

  onSubmit() {
    var f = $("form.frm-detail").validate();
    if (Object.keys(f.invalid).length !== 0) {
      return;
    }
  
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

          let currentCateCd=this.detailInfo.cate_cd;
          this.detailInfo = new GeneralMasterModel();
          this.detailInfo.cate_cd=currentCateCd;
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
    this.isFilterGrid=true;
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
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
  
}

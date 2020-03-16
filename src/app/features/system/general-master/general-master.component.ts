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

import { AuthService } from '@app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { ProgramService } from '@app/core/services';
import { BasePage } from '@app/core/common/base-page';
import { I18nService } from '@app/shared/i18n/i18n.service';
@Component({
  selector: 'sa-general-master',
  templateUrl: './general-master.component.html',
  styleUrls: ['./general-master.component.css']
})
export class GeneralMasterComponent extends BasePage implements OnInit, CanDeactivateGuard {
  cate_cd: number;
  Categories: CategoryModel[] = [];
  parents: GeneralMasterModel[] = [];
  detailInfo: GeneralMasterModel;
  isFilterGrid:boolean=true;

  options: any;
  loggedUser: any = {};
  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,

    private generalMasterService: GeneralMasterService,
  ) {
    super(userService)
    this.cate_cd = Category.OrgCateCode;
    this.loggedUser = this.userService.getUserInfo();    
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
    this.checkPermission(ProgramList.General_Master.valueOf())
    this.detailInfo = this.generalMasterService.getModel();
    this.getCategories().then(data => {   
        this.Categories.push(...data);       
    });

    this.initDatatable();
  
  }
  
  onCateChange(cateId){
    if(this.isFilterGrid)
      $('select[name="filter_cate_cd"]').val(cateId).trigger('change');
  }
  private getCategories() {
    return this.generalMasterService.listGeneralCategory();
  }

  private getParents(value) {    
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/general/details/catecd/${value}`).subscribe(data => {                        
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

  private initDatatable() {
    //console.log('initDataTable');
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.generalMasterService.listGeneralAll().then(data => {
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
          }
          ,width:"120px", className: "word-wrap"
        },
        { data: "gen_nm",width:"200px",className: " word-wrap" },
        { data: "parent_cd",width:"80px",className: " word-wrap"},
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
        { data: "remark", className: "word-wrap", width:"300px" }
      ],
      pageLength:25,
      scrollX:true,
      //scrollY: 400,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.detailInfo = new GeneralMasterModel();
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
              var selectedText: string = rowSelected.gen_nm;
              this.notification.confirmDialog(
                "Delete General Master Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.generalMasterService.deleteGeneral(rowSelected).then(data=>{
                      if (!data.success) {
                        this.notification.showMessage("error", data.data.message);
                      } else {
                        this.notification.showMessage(
                          "success",
                          "Deleted successfully"
                        );
                        this.reloadDatatable();
                        this.detailInfo = new GeneralMasterModel();
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
    this.isFilterGrid=false;
    // let value = event.cate_cd;
    // this.onGetParent(value,event);
    setTimeout(() => {
      this.detailInfo = event;
    }, 10);

    setTimeout(() => {
      this.isFilterGrid=true;
    }, 200);
  }

  onSubmit() {
    
    this.detailInfo.cate_cd = $('.cate_cd').val();
    this.detailInfo.parent_cd = $('.parent_cd').val();
    if (this.detailInfo.gen_cd == undefined) {
      this.detailInfo.gen_cd = '0';
    }

    this.detailInfo.company_id = this.loggedUser.company_id;
    // console.log(`Submitting ${JSON.stringify(this.detailInfo)}`);
    if (this.detailInfo.gen_cd === '0') {
      this.generalMasterService.insertGeneralInfo(this.detailInfo).then(data => {
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
      this.generalMasterService.updateGeneralInfo(this.detailInfo).then(data => {
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
    this.generalMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }

  onCopy(){
    this.notification.confirmDialog(
      "Action Confirmation!",
      `Are you sure to copy new general master from sys-master?`,
      x => {
        if (x) {
          this.generalMasterService.copyGeneralFromSysGeneral(this.loggedUser.company_id).then(data => {
            if (!data.success) {
              this.notification.showMessage("error", data.data.message);
            } else {
              this.notification.showMessage("success", data.data.message);
              this.reloadDatatable();
            }
          });
        }
      }
    );
    
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}
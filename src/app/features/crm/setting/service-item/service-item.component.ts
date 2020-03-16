import { Component, OnInit, ViewChild, Input, AfterViewChecked, AfterViewInit } from '@angular/core';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { BasePage } from '@app/core/common/base-page';
import { NotificationService, AuthService, UserMasterService, CanDeactivateGuard, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { UserModel } from '@app/core/models/user.model';
import { TraderModel } from '@app/core/models/trader.model';
import { Router } from '@angular/router';
import { CrmMasServiceCategoryService, CrmMasServiceItemService } from '@app/core/services/crm/setting-item.service';
import { CrmMasServiceCategoryModel, CrmMasServiceItemModel } from '@app/core/models/crm/setting-item.model';
import { Category } from '@app/core/common/static.enum';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'sa-customer-master',
  templateUrl: './service-item.component.html',
  styleUrls: ['./service-item.component.css']
})
export class ServiceItemComponent extends BasePage implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    $(".dataTable .categorySelect, .dataTable .itemSelect").on("change", function () {
      // console.log($(this))
      // console.log($(this).val())
      let table
      let el = $(this)
      let searchText;
      if (el.val() != "") {
        searchText = el.children(":selected").text();
      } else {
        searchText = "";
      }
      let className = $(this).attr('class')
      if (className.search('categorySelect') != -1) {
        table = $('.tableCategory').DataTable();
      } else {
        table = $('.tableItem').DataTable();
      }
      table
        .column(el.parent().index() + ":visible")
        .search(searchText)
        .draw();
    });
  }
  userInfo: UserModel;
  currency: GeneralMasterModel[] = []
  unitOfCount: GeneralMasterModel[] = []
  level: any = []

  listCrmMasServiceCategoyModel: CrmMasServiceCategoryModel[] = []
  listParentCategory: CrmMasServiceCategoryModel[] = []
  listParentCategoryShow: CrmMasServiceCategoryModel[] = []

  crmMasServiceCategoyModel: CrmMasServiceCategoryModel
  crmMasServiceItemModel: CrmMasServiceItemModel
  validationOptionsCategory: any
  validationOptionsItem: any
  isSelecting: boolean
  isShowServiceItem: boolean = false
  isDisabled_use_yn_item: boolean
  isDeleteCatgory: boolean = false;
  isDeleteItem: boolean = false;


  isDisabled_Use_YN_Category: boolean


  // isParentLevel: boolean = true

  // luu service_cate_id cua bang category vao bien nay 


  //Data table option
  optionsCategory: {}
  optionsItem: {}

  constructor(
    private notificationService: NotificationService,

    public userService: AuthService,
    public userMasterService: UserMasterService,
    private generalMasterService: GeneralMasterService,
    public programService: ProgramService,


    public crmMasServiceCategoryService: CrmMasServiceCategoryService,
    public crmMasServiceItemService: CrmMasServiceItemService,
  ) {
    super(userService);
  }

  ngOnInit() {
    //general info


    this.loadGeneralInfo()

    // console.log("user", this.userInfo)
    this.initCategoryTable()
    this.initItemTable()


  }
  loadGeneralInfo() {
    this.userInfo = this.userService.getUserInfo();

    this.crmMasServiceCategoyModel = this.crmMasServiceCategoryService.initModel(this.userInfo.company_id)
    this.crmMasServiceItemModel = this.crmMasServiceItemService.initModel(this.userInfo.company_id)
    this.loadCurrency().then(data => {
      this.currency.push(...data)
      console.log("currency", this.currency)
    })
    this.loadUnitOfCount().then(data => {
      this.unitOfCount.push(...data)
      // console.log("unitOfCount", this.unitOfCount)
    })
    this.level = [1, 2, 3]
    this.initValidation()
  }

  loadCurrency() {
    return this.generalMasterService.listGeneralByCate(Category.CurrencyCateCode)
  }
  loadUnitOfCount() {
    return this.generalMasterService.listGeneralByCate(Category.ItemUnit)
  }
  //table 1
  initCategoryTable() {
    this.optionsCategory = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.crmMasServiceCategoryService.getList(this.loggedUser.company_id).then(data => {
          this.listCrmMasServiceCategoyModel = data
          this.listParentCategory = data;
          // console.log('List Service Categoy', this.listCrmMasServiceCategoyModel)
          callback({
            aaData: data
          })

          // setTimeout(() => {
          //   callback({
          //     aaData: data
          //   })
          // }, 1000);
        })
      },
      columns: [
        {
          // data: "crm_service_cate_nm",
          data: (row) => {
            // console.log(row)
            switch (row.level) {
              case 2:
                return '&nbsp;&nbsp;&nbsp;' + row.crm_service_cate_nm;
              case 3:
                return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + row.crm_service_cate_nm;
              default:
                return `<strong>${row.crm_service_cate_nm}</strong>`
            }
          },
        },
        {
          data: "level", width: "1%", class: 'center',

        },
        {
          data: (row) => {
            // console.log(row)
            if (row.parent_id == -1) {
              return ''
            } else {
              return row.items
            }
          },
          width: "1%",
          class: 'center'
        },
        {
          data: (row) => {
            // console.log(row)
            if (row.use_yn) {
              return 'Yes'
            } else {
              return 'No'
            }
          },
          width: "4%",
          class: 'center'
        },
      ],

      pageLength: 25,
      scrollY: 500,
      scrollX: true,
      paging: false,
      info: false,
      ordering: false,
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
            rowSelected.json_language = "";
            // console.log('rowSelected',rowSelected)
            if (rowSelected) {
              var selectedText: string = rowSelected.crm_service_cate_nm;
              this.notificationService.confirmDialog(
                "Delete Language Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.crmMasServiceCategoryService.delete(this.crmMasServiceCategoyModel).then(data => {
                      // console.log('Data Delete',data)
                      if (data.status != 1) {
                        this.notificationService.showMessage("error", data.data.message);
                      } else {
                        this.notificationService.showMessage(
                          "success",
                          "Deleted successfully"
                        );
                        this.reloadTableCategory();
                        // this.onResetFormCategory();
                      }
                    });
                  }
                }
              );
            }
          }
        },
        // {
        //   extend: "csv",
        //   text: "Excel"
        // },
        // {
        //   extend: "pdf",
        //   text: "Pdf"
        // },
        {
          extend: "print",
          text: "Print"
        }
      ]

    }
  }
  //table 2
  initItemTable() {
    this.optionsItem = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.crmMasServiceItemService.getList(this.loggedUser.company_id, this.crmMasServiceCategoyModel.crm_service_cate_id).then(data => {
          console.log('list item', data)
          callback({
            aaData: data
          })
        })
      },

      columns: [
        {
          // data: (row) => {
          //   return this.count++;
          // },
          data: 'crm_item_id',
          width: '1%', class: 'center'
        },
        {
          data: "crm_item_nm",
        },
        {
          data: 'price', class: 'right',
          render: $.fn.dataTable.render.number(',')
        },
        {
          // data: 'currency_gen_cd'
          data: (row) => {
            // console.log(row)
            var f = this.currency.filter(x => x.gen_cd == row.currency_gen_cd);
            if (f.length > 0)
              return f[0].gen_nm;
            else
              return "N/A";
          },
        },
        {

          data: (row) => {
            // console.log(row)
            var f = this.unitOfCount.filter(x => x.gen_cd == row.item_unit_gen_cd);
            if (f.length > 0)
              return f[0].gen_nm;
            else
              return "N/A";
          },
        },
        {
          data: 'vender_text'
        },
        {
          data: (row) => {
            // console.log(row)
            if (row.use_yn) {
              return 'Yes'
            } else {
              return 'No'
            }
          },
          width: "5%",
          class: 'center'
        },
        {
          data: 'remark',
          width: "200px"
        },
      ],

      pageLength: 25,
      scrollY: 500,
      scrollX: true,
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
            rowSelected.json_language = "";
            if (rowSelected) {
              var selectedText: string = rowSelected.crm_item_nm;
              this.notificationService.confirmDialog(
                "Delete Language Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.crmMasServiceItemService.delete(this.crmMasServiceItemModel).then(data => {
                      if (data.status != 1) {
                        this.notificationService.showMessage("error", data.data.message);
                      } else {
                        this.notificationService.showMessage(
                          "success",
                          "Deleted successfully"
                        );
                        this.reloadTableItem();
                        this.onResetFormItem();
                      }
                    });
                  }
                }
              );
            }
          }
        },

        // {
        //   extend: "csv",
        //   text: "Excel"
        // },
        // {
        //   extend: "pdf",
        //   text: "Pdf"
        // },

        {
          extend: "print",
          text: "Print"
        }
      ]

    }
  }

  onRowClickCategory(rowInfo) {
    this.isDeleteCatgory = true


    // this.crmMasServiceItemModel.use_yn = rowInfo.use_yn
    // var parentItem = this.listCrmMasServiceCategoyModel.filter(c => c.crm_service_cate_id == this.crmMasServiceItemModel.crm_service_cate_id)



    // Clone List Category để gán lại Parent Category Select2
    this.listParentCategoryShow = this.listCrmMasServiceCategoyModel.filter(c => c.level > 0)
    this.isSelecting = true;
    this.onResetFormItem();
    setTimeout(() => {
      this.crmMasServiceCategoyModel = rowInfo
      // this.crmMasServiceItemModel.use_yn = this.crmMasServiceCategoyModel.use_yn 

      var parentCategory = this.listCrmMasServiceCategoyModel.filter(c => c.crm_service_cate_id == this.crmMasServiceCategoyModel.parent_cate_id)
      // console.log('parentCategory',parentCategory)

      // nếu category có level bằng 1 thì ko disable Use Y/n
      if (parentCategory.length == 0)
        this.isDisabled_Use_YN_Category = false

      if (parentCategory[0].use_yn == false) {
        this.isDisabled_Use_YN_Category = true
      } else {
        this.isDisabled_Use_YN_Category = false
      }

      if (this.crmMasServiceCategoyModel.final_level_yn) {
        this.isShowServiceItem = true
        this.crmMasServiceItemModel.crm_service_cate_id = this.crmMasServiceCategoyModel.crm_service_cate_id;
      }
      else {
        this.isShowServiceItem = false;
        this.crmMasServiceItemModel.crm_service_cate_id = 0;
      }
      // this.initItemTable();
      this.reloadTableItem();
    }, 1);
  }

  onRowClickItem(value) {
    this.isDeleteItem = true
    this.crmMasServiceItemModel = value

    var parentItem = this.listCrmMasServiceCategoyModel.filter(c => c.crm_service_cate_id == this.crmMasServiceItemModel.crm_service_cate_id)
    if (parentItem[0].use_yn == false) {
      this.isDisabled_use_yn_item = true
      // console.log('this.isDisabled_use_yn_item', this.isDisabled_use_yn_item)
    } else {
      this.isDisabled_use_yn_item = false
    }
  }

  reloadTableItem() {
    $(".tableItem")
      .DataTable()
      .ajax.reload();
  }
  reloadTableCategory() {
    $(".tableCategory")
      .DataTable()
      .ajax.reload();
  }
  onSubmitCategoryForm() {

    // console.log(this.crmMasServiceCategoyModel)
    if (!this.crmMasServiceCategoyModel.parent_cate_id) {
      this.crmMasServiceCategoyModel.parent_cate_id = 0
    }
    if (this.crmMasServiceCategoyModel.level == 3) {
      this.crmMasServiceCategoyModel.final_level_yn = true;
    }
    this.crmMasServiceCategoryService.addOrUpdate(this.crmMasServiceCategoyModel).then(data => {
      // console.log('Data Insert', data)
      if (data.status == 1) {
        this.notificationService.showMessage("success", data.message);
        this.reloadTableCategory();
        this.reloadTableItem();
        // this.onResetFormItem();
        // this.onResetFormCategory();
      } else {
        this.notificationService.showMessage("error", data.message);
      }
    })
  }
  onSubmitItemForm() {
    this.crmMasServiceItemService.addOrUpdate(this.crmMasServiceItemModel).then(data => {
      // console.log('Data Insert', data)
      if (data.status == 1) {
        this.notificationService.showMessage("success", data.message);
        this.reloadTableCategory()
        this.reloadTableItem();
        // this.onResetFormItem();
      } else {
        this.notificationService.showMessage("error", data.message);
      }
    })
  }
  onResetFormCategory() {
    this.isDeleteCatgory = false

    this.crmMasServiceCategoyModel = this.crmMasServiceCategoryService.initModel(this.userInfo.company_id)
    this.crmMasServiceItemModel = this.crmMasServiceItemService.initModel(this.userInfo.company_id);
    this.isSelecting = false;
    this.isShowServiceItem = false;
    this.reloadTableItem();
  }
  onResetFormItem() {
    this.isDeleteItem = false

    let oldCatID = this.crmMasServiceItemModel.crm_service_cate_id;
    this.crmMasServiceItemModel = this.crmMasServiceItemService.initModel(this.userInfo.company_id);
    this.crmMasServiceItemModel.crm_service_cate_id = oldCatID
  }

  initValidation() {
    this.validationOptionsCategory = {
      ignore: [],
      rules: {
        level: {
          required: true
        },
        // parent_cate_id: {
        //   required: true,
        // }
      },
      // Messages for form validation
      messages: {
        level: {
          required: "Please select level"
        },
        // parent_cate_id: {
        //   required: "Please select Parent Category"
        // }
      }
    };

    this.validationOptionsItem = {
      ignore: [],
      rules: {
        currency_gen_cd: {
          required: true
        },
        item_unit_gen_cd: {
          required: true,
        }
      },
      // Messages for form validation
      messages: {
        level: {
          currency_gen_cd: "Select Currency"
        },
        item_unit_gen_cd: {
          required: "Unit of count"
        }
      }
    };
  }
  onChangeLevel(value) {

    this.listParentCategoryShow = this.listCrmMasServiceCategoyModel.filter(c => c.level == value - 1)


    // if(curLevel!=value){
    //   this.listParentCategory = this.listCrmMasServiceCategoyModel.filter(c => c.level == value - 1)
    //   console.log('List parent',this.listParentCategory)
    // }
    //this.crmMasServiceCategoyModel.level = value;
    // if(value==1){
    //   this.listParentCategory=[];
    //   let root=new CrmMasServiceCategoryModel();
    //   root.crm_service_cate_id=0;
    //   root.crm_service_cate_nm='Root';
    //   this.listParentCategory.push(root)
    // }
    // else{
    //   this.listParentCategory = this.listCrmMasServiceCategoyModel
    // }

  }
  onDeleteCategory() {
    var selectedText: string = ''
    this.notificationService.confirmDialog(
      "Delete Language Confirmation!",
      `Are you sure to delete ${selectedText}?`,
      x => {
        if (x) {
          this.crmMasServiceCategoryService.delete(this.crmMasServiceCategoyModel).then(data => {
            // console.log('Data Delete',data)
            if (data.status != 1) {
              this.notificationService.showMessage("error", data.data.message);
            } else {
              this.notificationService.showMessage(
                "success",
                "Deleted successfully"
              );
              this.reloadTableCategory();
              this.onResetFormCategory();
            }
          });
        }
      }
    );
  }
  onDeleteItem() {
    var selectedText: string = ''
    this.notificationService.confirmDialog(
      "Delete Language Confirmation!",
      `Are you sure to delete ${selectedText}?`,
      x => {
        if (x) {
          this.crmMasServiceItemService.delete(this.crmMasServiceItemModel).then(data => {
            // console.log('Data Delete',data)
            if (data.status != 1) {
              this.notificationService.showMessage("error", data.data.message);
            } else {
              this.notificationService.showMessage(
                "success",
                "Deleted successfully"
              );
              this.reloadTableCategory();
              this.reloadTableItem();
              this.onResetFormItem();
            }
          });
        }
      }
    );
  }
  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }










}

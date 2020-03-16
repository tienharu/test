import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CrmSalesOpportunityModel } from '@app/core/models/crm/sales-opportunity.model';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, UserMasterService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { CrmSalesOpportunityService } from '@app/core/services/crm/sale-opportunity.service';
import { Category } from '@app/core/common/static.enum';
import { BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { ExpensesModel, ExpensesContactorModel, ContactorLessModel } from '@app/core/models/crm/expenses-magt.model';
import { CrmProjectService } from '@app/core/services/crm/project.service';
import { ExpensesService } from '@app/core/services/crm/expenses-magt.service';
import { CommonFunction } from '@app/core/common/common-function';

@Component({
  selector: 'sa-expenses-magt-popup',
  templateUrl: './expenses-magt-popup.component.html',
  styleUrls: ['./expenses-magt-popup.component.html']
})
export class ExpensesPopupComponent extends BasePage implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {

  }

  onFileChange(event) {
    // console.log('onFileChange', event)
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      let val = reader.result.toString()
      reader.onload = () => {
        this.inputModel.model.file_data = {
          file_name: file.name,
          file_type: file.type,
          value: reader.result.toString()
        }
        // console.log(this.inputModel.model.file_data)
      };
    }
  }
  userLogin: any;
  expensesContactorModel: ExpensesContactorModel
  contactorLessModel: ContactorLessModel
  test: any = []
  optionsDatePicker: any = {}
  optionsSelect: any = {}
  attacthedFileName: any = '';
  ContactorLessModel
  @Input() inputModel: any;
  @Input() isDisabledCredit: any;

  @Output() childCall = new EventEmitter();
  constructor(
    private notification: NotificationService,
    public userService: AuthService,
    private modalService: BsModalService,
    public expensesService: ExpensesService,

  ) {
    super(userService);
  }

  ngOnInit() {
    function addIcon(icon) {
      var dataIcon = icon.element;
      var el = $(dataIcon)
      if (icon.id != undefined) {
        var type = icon.id.split('-')[0]
      }
      var spann = $('<span ></span>');
      // console.log(icon)
      // console.log(type)
      if (icon.text == 'Opportunity' || icon.text == 'Project') {
        spann.addClass('expensesGroup')
      }
      if (type == 1) {
        spann.append('<label  class="lableExpenses" >Sales</label>')
      }
      if (type == 2) {
        spann.append('<label  class="lableExpenses" style="background-color:#2185d0">Project</label>')
      }
      return spann.append('&ensp;&ensp;' + icon.text)
    }
    this.optionsSelect = {
      multiple: false,
      templateSelection: addIcon,
      templateResult: addIcon,
    }
    this.userLogin = this.userService.getUserInfo();
    // console.log('this.inputModel.model.expenses_contactor', this.inputModel.model.expenses_contactor)

    // gán thêm  type  của expenses_contactor theo dạng   type - value
    this.test = []
    for (let item of this.inputModel.model.expenses_contactor) {
      console.log(item)
      if (item.with_type == 1 && item.person_type == 0) {
        this.test.push('1-' + item.with_ref_id)
      }
      if (item.with_type == 2 && item.person_type == 2) {
        this.test.push('2-' + item.with_ref_id)
      }
      if (item.with_type == 1 && item.person_type == 1) {
        this.test.push('3-' + item.with_ref_id)
      }
    }
    // console.log('this.test',this.test)


    setTimeout(() => {
      $("#s2").val(this.test).trigger("change");
    }, 100);
    this.attacthedFileName = this.getFileName(this.inputModel.model.bill_attach_file);
  }

  getFileName(path) {
    if (path) {
      return path.replace(/^.*[\\\/]/, '')
    }
  }
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      created_time: {
        required: true
      },
      expenses_gen_cd: {
        required: true
      },
      expenses_amt: {
        required: true
      },
      pay_type_gen_cd: {
        required: true
      },
      credit_card_gen_cd: {
        required: true
      },
      sales_opt_id: {
        required: false
      },
      customer_contactor_id: {
        required: false
      }
    },
    // Messages for form validation
    messages: {
      created_time: {
        required: "Please enter"
      },
      expenses_gen_cd: {
        required: "Please select"
      },
      expenses_amt: {
        required: "Please select"
      },
      pay_type_gen_cd: {
        required: "Please select"
      },
      credit_card_gen_cd: {
        required: "Please select"
      },
      sales_opt_id: {
        required: "Please select"
      },
      customer_contactor_id: {
        required: "Please select"
      }
    }
  };

  onSubmit() {
    this.convertSales_opt_idToNumber()
    console.log("this.inputModel.model", this.inputModel.model)

    this.expensesService.addOrUpdate(this.inputModel.model).then(data => {
      if (data.error) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        CommonFunction.ReloadDataTable('tableExpenses')
      }
    });
  }

  //Cắt chuỗi trước khi post lên server  ko lấy type chỉ lấy value của sales_opt_id hoặc project_id nếu chọn sales_opt_id thì gán project_id = null và ngược lại
  convertSales_opt_idToNumber() {
    if (this.inputModel.model.sales_opt_id != null) {
      let val = this.inputModel.model.sales_opt_id.split('-')[1]
      this.inputModel.model.sales_opt_id = val
    }
    if (this.inputModel.model.project_id != null) {
      let val = this.inputModel.model.project_id.split('-')[1]
      this.inputModel.model.project_id = val
    }
  }

  onReset() {
    $("form.frm-detail")
      .validate()
      .resetForm();

    this.inputModel.model = this.expensesService.initModel(this.companyInfo.company_id)
    $(".selectExpenses").find('option').prop("selected", false);
    $(".selectExpenses").trigger('change');

  }

  onClose() {
    this.modalService.hide(1);
  }
  onDelete() {
    this.convertSales_opt_idToNumber()
    console.log('this.inputModel.model', this.inputModel.model)
    this.notification.confirmDialog(
      "Deleting this item ?",
      `Deleting an item will move it to the <span class='warning-emphasize'>trash</span>.<br />
    Deleted items <span class='warning-emphasize'>can</span> be <span class='warning-emphasize'>recovered from the Recycle Bin within 30 days</span>.<br />
    Do you want to continue?`,
      x => {
        if (x) {
          this.expensesService.delete(this.inputModel.model).then(data => {
            if (data.error) {
              this.notification.showMessage("error", data.error.message);
            } else {
              this.notification.showMessage("success", data.message);
              CommonFunction.ReloadDataTable('tableExpenses')
              this.onClose()
            }
          })
        }
      }
    );
  }
  onChangePayment() {
    this.isDisabledCredit = false;
  }

  onOppOrProject(value) {
    // console.clear()
    // console.log('Value change', value)

    //Change combobox chỉ lấy 1 trong 2 model , model còn lại sẽ gán null
    let type = value.split('-')[0]
    if (type == 1) {
      this.inputModel.model.project_id = null
      this.inputModel.model.sales_opt_id = value
    }
    if (type == 2) {
      this.inputModel.model.sales_opt_id = null
      this.inputModel.model.project_id = value
    }
    // console.log('model', this.inputModel.model)
  }
  onChangeCusConUser(value) {
    // this.test = value

    //Cắt chuỗi chỉ lấy value insert 1 list vào bảng expenses_contactor
    this.inputModel.model.expenses_contactor = []
    for (let item of value) {
      let contactorLessModel = new ContactorLessModel()
      let type = item.split('-')[0]
      let val = item.split('-')[1]
      contactorLessModel.company_id = this.inputModel.model.company_id
      contactorLessModel.expenses_id = this.inputModel.model.expenses_id
      contactorLessModel.with_ref_id = val
      if (type == 1) {
        contactorLessModel.with_type = 1
        contactorLessModel.person_type = 0
      }
      if (type == 2) {
        contactorLessModel.with_type = 2
        contactorLessModel.person_type = 2
      }
      if (type == 3) {
        contactorLessModel.with_type = 1
        contactorLessModel.person_type = 1
      }
      this.inputModel.model.expenses_contactor.push(contactorLessModel)
    }
    // console.log('onChangeCusConUser', this.inputModel.model.expenses_contactor)
  }
  clearAll(){
    // $("#expenses").find('option').prop("selected", false);
    // $("#expenses").trigger('change');

    // $("#s2").find('option').prop("selected", false);
    // $("#s2").trigger('change');

    $(".selectExpenses").find('option').prop("selected", false);
    $(".selectExpenses").trigger('change');
  }
}

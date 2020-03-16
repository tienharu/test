import { Component, OnInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { NotificationService } from '@app/core/services/notification.service';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { AuthService, ProgramService } from '@app/core/services';
import { NewsModel } from '@app/core/models/news.model';
import { NewsService } from '@app/core/services/features.services/news.service';
import { Observable } from 'rxjs';
import { ProgramList } from '@app/core/common/static.enum';

@Component({
  selector: 'sa-news-master',
  templateUrl: './news-master.component.html',
  styleUrls: ['./news-master.component.css']
})
export class NewsMasterComponent extends BasePage implements OnInit {
  NewsInfo: NewsModel;
  options: any;
  companies: any = [];
  defaultContent: string = '';
  constructor(
    private api: CRMSolutionApiService,
    public userService: AuthService,
    private notification: NotificationService,
    private i18nService: I18nService,
    public programService: ProgramService,
    private NewsService: NewsService
  ) {
    super(userService);
  }

  ngOnInit() {
    //this.checkPermission(ProgramList.News_master.valueOf())
    this.NewsInfo = this.NewsService.getModel();
    this.NewsInfo.company_id = this.companyInfo.company_id;
    this.companies.push(this.companyInfo)
    this.initDatatable();
    $(".news-content").summernote({
      height: 400,
    });
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      title: {
        required: true
      },
      description: {
        required: true
      },
      // content: {
      //   required: true
      // },
    },
    // Messages for form validation
    messages: {
      title: {
        required: "Please input"
      },
      description: {
        required: "Please input"
      },
      // content: {
      //   required: "Please input"
      // }
    }
  };

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.NewsService.listNews(this.companyInfo.company_id).then(data => {
          callback({
            aaData: data
          });
        })
      },
      columns: [

        { data: "id", className: "center", width: "60px" },
        { data: "title", className: "", },
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center",
          width: "60px"
        },

        { data: "creator", className: "", width: "90px" },
        { data: "created_time", className: "center", width: "90px" },
      ],
      scrollY: 210,
      scrollX: true,
      paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.NewsInfo = new NewsModel();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-times text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if (!this.permission.canDelete) {
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.title;
              this.notification.confirmDialog(
                "Delete News Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.NewsService.deleteNews(this.NewsInfo).then(data => {
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
    
    setTimeout(() => {
      this.NewsInfo = event;
      // console.log("defaultContent",this.defaultContent)
      $('.news-content').summernote('code', this.NewsInfo.content);
    }, 100);
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
  }

  onSubmit() {
    this.NewsInfo.content = $('.note-editable').html();;
    this.NewsService.saveNews(this.NewsInfo).then(data => {
      if (data.error) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.reloadDatatable();
      }
    });
  }

  onReset() {
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.NewsService.resetModel();
    this.NewsInfo = this.NewsService.getModel();
    this.NewsInfo.company_id = this.companyInfo.company_id;
    $('.news-content').summernote('code', "");
    this.reloadDatatable();
  }

  private reloadDatatable() {
    $(".newsListInfo")
      .DataTable()
      .ajax.reload();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.NewsService.storeTemporaryModel(this.NewsInfo);
    return true;
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
}

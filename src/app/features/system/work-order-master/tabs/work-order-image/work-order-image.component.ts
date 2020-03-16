import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, Renderer } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService, CRMSolutionApiService, NotificationService } from '@app/core/services';
import { WorkOrderMasterService } from '@app/core/services/features.services/work-order-master.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { I18nService } from '@app/shared/i18n/i18n.service';
import _ from "lodash";
import { DownloadImageService } from '@app/core/services/download-image.service';

@Component({
  selector: 'sa-work-order-image',
  templateUrl: './work-order-image.component.html',
  styleUrls: ['./work-order-image.component.css']
})
export class WorkOrderImageComponent extends BasePage implements OnInit {
  //-----------------------------------------
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  @Output() childCall = new EventEmitter();
  @Input() woNo: number = null;
  @Input() stepSeq: number = null;
  @Input() styleSysId: number = null;

  private ctx: CanvasRenderingContext2D;


  uploadImage: any = {};
  attachImages: any;
  imageSelected: boolean = false;

  uploadFile: any = {};
  attachFiles: any;
  fileSelected: boolean = false;

  options: any;
  data: any = [];
  listenFunc: Function;
  constructor(
    private api: CRMSolutionApiService,
    public programService: ProgramService,
    public userService: AuthService,
    public workOrderMasterService: WorkOrderMasterService,
    private modalService: BsModalService,
    private i18nService: I18nService,
    private notification: NotificationService,
    private renderer: Renderer,
    private elementRef: ElementRef,
    private downloadImageService: DownloadImageService,

    

  ) {
    super(userService);
    this.listenFunc = renderer.listen(elementRef.nativeElement, 'click', (event) => {
			if (event.target.id == 'workOrderFileDownload') {
				let fileName = event.target.attributes['alt'].value;
        let path = event.target.attributes['path'].value;
        let fileType = event.target.attributes['fileType'].value;

        this.downloadFile(fileName, path, fileType);
			}
		});
  }

  ngOnInit() {
    var self = this;
    self.ctx = this.canvas.nativeElement.getContext('2d');
    self.woNo = Number(self.woNo);
    self.styleSysId = Number(self.styleSysId);
    self.initDatatable();
    if (self.woNo && self.stepSeq) {
      self.search();
    }
  }

  onReset() {
    this.data = [];
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        callback({
          aaData: []
        });
      },
      columns: [
        { data: "uploadPass", width: "20%", className: "text-left" },
        // {
        //   data: (data, type, dataToSet) => {
        //     if (data.attachFiles === null) {
        //       return "";
        //     }
        //     var fileName = data.attachFiles.substring(data.attachFiles.lastIndexOf('/') + 1);
        //     var path = "/wwwroot/" + data.attachFiles
        //     return `<a href="${path}" target="_blank" alt="${fileName}">
        //     <p style="white-space: nowrap;
        //     overflow: hidden;
        //     text-overflow: ellipsis; ">${fileName}</p>
        //     </a>`;
        //   },
        //   className: "attachFiles", width: "40%", class: "center"
        // },
        {
          data: (data, type, dataToSet) => {
            if (data.attachFiles === null) {
              return "";
            }
            let enCodePath = encodeURI(data.attachFiles); 
            let path = enCodePath.replace(/%5C/g,'/');
            let fileName = path.substring(path.lastIndexOf('/') + 1);
            return `<a>
            <p style="white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis; " id="workOrderFileDownload" alt="${fileName}" fileType="${data.uploadType}" path="${path}">${fileName}</p>
            </a>`;
          },
          className: "attachFiles", width: "70%", class: "left"
        },
        {
          data: (data, type, dataToSet) => {
            return data.uploadType === 1 ? 'Image' : 'File';
          },
          className: "center", width: "10%"
        },
      ],
      scrollY: 210,
      scrollX: false,
      paging: true,
      pageLength: 25,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            this.search();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-times text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            // if (!this.permission.canDelete) {
            //   this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
            //   return;
            // }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              this.notification.confirmDialog(
                "Delete Confirmation!",
                `Are you sure to delete?`,
                x => {
                  if (x) {
                    this.workOrderMasterService.deleteWorkOrderImage(rowSelected).then(data => {
                        if (!data.success) {
                          this.notification.showMessage("error", data.data.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            "Deleted successfully"
                          );
                          this.search();
                        }
                      });
                  }
                }
              );
            }
          }
        }
      ]
    };
  }

  private search() {
    var self = this;
    return self.workOrderMasterService.getWorkOrderImageById(self.woNo, self.stepSeq).then(function (rs) {
      self.data = rs;
      var table = $('.work-order-upload-table').DataTable();
      table.clear();
      table.rows.add(self.data).draw();
    });
  }

  onRowClick(data) {
    // if (data.attachFiles === null) {
    //   return "";
    // }
    // var fileName = data.attachFiles.substring(data.attachFiles.lastIndexOf('/') + 1);
    // this.downloadImg(data.attachFiles);
    // var path = "/wwwroot/"+ data.attachFiles
    // this.modalService.hide(1);
  }

  downloadFile(fileName, path, filteType){
    var self = this;
    // if(filteType === 1){
    //   return self.downloadImageService.downloadFile(fileName, path).then(function(data){
    //     var urlImg = window.URL.createObjectURL(data);
    //     console.log(urlImg);
    //     console.log(data);
    //     self.loadCanvas(urlImg);
    //   });
    // }else{
      
    // }
    return this.downloadImageService.showImage(fileName, path);
  }


  onSubmit() {
    var self = this;
    var dataF = null, dataI = null;
    self.notification.showCenterLoading();
    if (!self.imageSelected && !self.fileSelected) {
      self.notification.showError('Please select File or Image for upload.');
      self.notification.hideCenterLoading();
      return;
    }
    if (self.uploadFile && self.fileSelected) {
      dataF = {
        woNo: self.woNo,
        stepSeq: self.stepSeq,
        uploadFiles: self.uploadFile,
        uploadType: 2,
        uploadPass: self.uploadFile.fileName,
      };
    }
    if (self.uploadImage && self.imageSelected) {
      dataI = {
        woNo: self.woNo,
        stepSeq: self.stepSeq,
        uploadFiles: self.uploadImage,
        uploadType: 1,
        uploadPass: self.uploadImage.fileName,
      };
    }
    var req = new Promise<any>((resolve, reject) => {
      resolve(null);
    });
    if (dataF) {
      req = self.workOrderMasterService.insertWorkOrderImage(dataF).then(function (rs) {
        if (rs) {
          self.notification.showSuccess('Upload file success');
          self.uploadFile = null;
          self.fileSelected = false;
          self.attachFiles = '';
        }
        return rs;
      });
    }
    if (dataI) {
      req = self.workOrderMasterService.insertWorkOrderImage(dataI).then(function (rs) {
        if (rs) {
          self.notification.showSuccess('Upload image success');
          self.uploadImage = null;
          self.imageSelected = false;
          self.attachImages = '';
        }
        return rs;
      });
    }
    return req.then(rs => {
      self.notification.hideCenterLoading();
      self.search();
    });
  }

  onClose() {
    this.modalService.hide(1);
  }

  onChangeImages(event) {
    var self = this;
    self.imageSelected = false;
    self.uploadImage = {};
    let file = (event.target.files && event.target.files[0]) || null;
    let fileReader = new FileReader();
    if (file) {
      self.attachImages = file.name || '';
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        self.imageSelected = true;
        self.uploadImage = { fileName: file.name, fileType: file.type, value: fileReader.result.toString() };
      }
    }
  }

  onChangeFiles(event) {
    var self = this;
    self.fileSelected = false;
    self.uploadFile = {};
    let file = (event.target.files && event.target.files[0]) || null;
    let fileReader = new FileReader();
    if (file) {
      self.attachFiles = file.name || '';
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        self.fileSelected = true;
        self.uploadFile = { fileName: file.name, fileType: file.type, value: fileReader.result.toString() };
      }
    }
  }

  loadCanvas(dataURL) {
    var self = this;
    setTimeout(function () {
      var canvas = self.ctx.canvas;
      var context = self.ctx.canvas.getContext('2d');
      // load image from data url
      var imageObj = new Image();
      imageObj.onload = function () {
        canvas.width = 764
        canvas.height = 625;
        context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, 0, 0, 764, 625);
        window.URL.revokeObjectURL(dataURL);
      };
      imageObj.src = dataURL;
    }, 800);
  }
}

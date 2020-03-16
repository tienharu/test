import { Injectable } from '@angular/core';
import * as toastr from 'toastr';

declare var $: any;

@Injectable()
export class NotificationService {

  constructor() {
  }

  smallBox(data, cb?) {
    $.smallBox(data, cb)
  }

  bigBox(data, cb?) {
    $.bigBox(data, cb)
  }

  smartMessageBox(data, cb?) {
    $.SmartMessageBox(data, cb)
  }
  confirmDialog(title:string,content:string, callback:any, faIcon:any="warning", noBtn:string="No", yesBtn:string="Yes"){
    if(!title)
      title='Confirmation';
    if(!content)
      content='Are you sure?';

    $.SmartMessageBox({
      title : `<i class='fa fa-${faIcon}'></i> <span class="">${title}</span>`,//txt-color-orangeDark
      content : content,
      buttons : `[${noBtn}][${yesBtn}]`

    }, (ButtonPressed) => {
      if(callback){
        callback(ButtonPressed == yesBtn)
      }
      // if (ButtonPressed == yesBtn) {
      //   callback(callback)
      // }
    });
  }
  
  showMessage(type, message, options?) {
    //http://codeseven.github.io/toastr/demo.html
    toastr.options = {
      "closeButton": true,
      "positionClass": "toast-top-right",
      "showDuration": "200",
      "hideDuration": "200",
      "progressBar": false,
      "newestOnTop": true,
      "timeOut": "5000",
      "extendedTimeOut": "0"
    }
    if (options) {
      toastr.options = $.extend(toastr.options, options)
    }

    switch (type) {
      case "success":
        toastr.success(message);
        break;
      case "error":
        toastr.error(message);
        break;
      case "info":
        toastr.info(message);
        break;
      case "warning":
        toastr.warning(message);
        break;
      default:
        toastr.message(message);
        break;
    }
  }
  showError(message, options?){
    this.showMessage("error",message, options);
  }
  showSuccess(message, options?){
    this.showMessage("success",message, options);
  }
  showWarning(message, options?){
    this.showMessage("warning",message, options);
  }
  showInfo(message, options?){
    this.showMessage("info",message, options);
  }
  showCenterLoading(){
    if(window.parent){
      $(window.parent.document).find('.center-loading').show();
    }
    else{
      $('.center-loading').show();
    }
  }
  hideCenterLoading(){
    if(window.parent){
      $(window.parent.document).find('.center-loading').hide();
    }
    else{
      $('.center-loading').hide();
    }
    
  }
}

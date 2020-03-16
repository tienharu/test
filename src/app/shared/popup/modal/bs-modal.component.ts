import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';

import jarvisPopupDefaults from  '../modal.defaults';
import {ElementRef} from "@angular/core";

import 'smartadmin-plugins/smartwidgets/jarvis.widget.ng2.js'

declare var $: any;
@Component({

  selector: 'sa-popup-modal',
  templateUrl: "./modal.template.html",
  styles: []
})

export class ModalComponent implements OnInit,AfterViewInit {
  
  @Input() public headerTitle:any;
  @Output() public onClose = new EventEmitter<any>();

  @Input() public width:number;
  @Input() public height:number;
  @Input() public icon:string;
  @Input() public allowFullScreen:boolean=true;

  constructor(public el: ElementRef) {}

  ngOnInit(): void {
    if(!this.icon){
      this.icon='fa-bell-o';
    }
    if(!this.width){
      this.width=800;
    }
    // if(!this.height){
    //   $(this.el.nativeElement).parent().height(this.height);
    // }
    // $('#popup-modal').width(this.width);
    // $('#popup-modal').height(this.height);
    $(this.el.nativeElement).parent().parent().width(this.width);
    
  }
  ngAfterViewInit() {
      //$('#popup-modal', this.el.nativeElement).jarvisWidgets(jarvisPopupDefaults);
      $('.modal-content').draggable({
        handle: ".jarviswidget header"
      });
      $('#popup-modal').resizable({
        alsoResize: ".modal-content",
        minHeight: 200,
        minWidth: 300
      });
      //console.log(this.el.nativeElement)
  }

  toggleCollapse(){
    //content
    $('#popup-modal .jarviswidget div[role="content"]').toggle();
    $('.jarviswidget-fullscreen-btn').toggle();
    $('.jarviswidget-delete-btn').toggle();
    
    // if(!$('#popup-modal .jarviswidget div[role="content"]').is(":visible")){
    //   $('.jarviswidget-toggle-btn').html('<i class="fa fa-plus"></i>').attr('title','Expand');
    // }
    // else{
    //   $('.jarviswidget-toggle-btn').html('<i class="fa fa-minus"></i>').attr('title','Collapse');
    // }
  }
  toggleFullscreen(){
    $('#popup-modal .jarviswidget').toggleClass("full-screen")
    if($('#popup-modal .jarviswidget.full-screen').length){
      $(".jarviswidget-fullscreen-btn").html('<i class="fa fa-compress "></i>');
      $(this.el.nativeElement).parent().parent().addClass('modal-full-screen')
    }
    else{
      $(".jarviswidget-fullscreen-btn").html('<i class="fa fa-expand "></i>');
      $(this.el.nativeElement).parent().parent().removeClass('modal-full-screen')
    }
  }
  closePopup(){
    if(this.onClose){
      this.onClose.emit();
    }
    else{
    }
  }
 
}

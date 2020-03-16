import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Output,
  EventEmitter
} from "@angular/core";

import "summernote/dist/summernote.min.js";

@Directive({
  selector: "[summernote]"
})
export class SummernoteDirective implements OnInit {
  @Input() summernote = {};
  @Output() change = new EventEmitter();
  @Input() defaultVal: string="";
  constructor(private el: ElementRef) {}

  ngOnInit() {
    var HTMLstring = '<div><p>Hello, world</p><p>Summernote can insert HTML string</p></div>';
    // console.log("this.defaultVal",this.defaultVal)
    // $(this.el.nativeElement).summernote('insertText', this.defaultVal);
  //   setTimeout(function(){
  //     (this.el.nativeElement).summernote('insertText', this.defaultVal);
  // }, 1000);
  $(this.el.nativeElement).summernote('code', this.defaultVal);
    // $(this.el.nativeElement).summernote(
    //   {
    //     onPaste: function (e) {
    //       var defaultdata = ((e.originalEvent || e).clipboardData).getData('Text');
    //       e.preventDefault();
    //       document.execCommand('insertText', false, defaultdata);
    //     },
    //     callbacks: {
    //       onChange: (contents) => {
    //         this.change.emit(contents);
    //       }
    //     },
        
    //   }
    // );
  }
}

import {
  Directive,
  ElementRef,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges
} from "@angular/core";
import { addClassName, removeClassName } from "@app/shared/utils/dom-helpers";
import "select2/dist/js/select2.min.js";

@Directive({
  selector: "[select4]"
})
export class Select4Directive implements OnInit, OnChanges {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);
  @Output() onSelectedChange = new EventEmitter<string[]>();
  @Input() defaultVal: string[];
  @Input() placeHolder: string;
  @Input() allowClear: boolean;
  @Input() autoEmitModel: boolean;
  @Input() options: any = {};


  constructor(private el: ElementRef) {
    addClassName(this.el.nativeElement, ["sa-cloak", "sa-hidden"]);

  }

  ngOnInit() {
    if (this.autoEmitModel == undefined) {
      this.autoEmitModel = true;
    }
    let el = $(this.el.nativeElement);
    el.select2($.extend({
      placeholder: "Please Select ...",
      allowClear: true
    }, this.options));

    el.on("change", (e: any) => {
      let v = $(e.target).val();
      //console.log('change: '+v)
      if (this.autoEmitModel == true) {
        this.ngModelChange.emit(v);
      }
      if (this.onSelectedChange) {
        this.onSelectedChange.emit(v);

      }

      //check error state
      if (v != "") {
        let elParent = $(this.el.nativeElement).parent();
        if (elParent.hasClass("state-error")) {
          elParent.removeClass("state-error").addClass("state-success");
          $(this.el.nativeElement).removeClass("invalid");
          $(this.el.nativeElement)
            .next("span")
            .next("em")
            .hide();
        }
      }
      // else{
      //   if($(this.el.nativeElement).attr('required')){
      //     let elParent=$(this.el.nativeElement).parent();
      //     elParent.addClass('state-error').removeClass('state-success');
      //     $(this.el.nativeElement).addClass('invalid');
      //     //$(this.el.nativeElement).next('span').next('em').show();
      //   }
      // }
    });

    removeClassName(this.el.nativeElement, ["sa-hidden"]);
  }

  ngOnChanges(changes) {
    //console.log(`Select2Directive ngOnChanges: ${JSON.stringify(changes)}`)
    if (!changes.firstChange) {
      let val;
      if (changes.defaultVal != null && changes.defaultVal !== undefined) {
        val = changes.defaultVal.currentValue;
      }

      if (val == null || val === undefined) val = "";
      $(this.el.nativeElement)
        .val(val)
        .trigger("change");
    }
  }
}

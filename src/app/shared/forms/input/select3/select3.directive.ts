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
  selector: "[select3]"
})
export class Select3Directive implements OnInit, OnChanges {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);
  @Input() options: {}
  @Input() defaultVal: string[];
  @Input() placeHolder: string;
  @Input() allowClear: boolean;
  @Input() autoEmitModel: boolean;

  constructor(private el: ElementRef) {
    addClassName(this.el.nativeElement, ["sa-cloak", "sa-hidden"]);
  }

  ngOnInit() {
    if (this.autoEmitModel == undefined) {
      this.autoEmitModel = true;
    }
    function addIcon(icon) {
      var dataIcon = icon.element;
      return $('<span><i class="fa ' + $(dataIcon).data('icon') + '"></i> ' + icon.text + '</span>');
  }
    let el = $(this.el.nativeElement);
    el.select2( {
        placeholder: "Select please ...",
        allowClear: true,
        multiple:true,
        // closeOnSelect: false,
        // theme:'default'
        templateSelection: addIcon,
        templateResult: addIcon,
        allowHtml: true
      }
    );

    el.on("change", (e: any) => {
      let v = $(e.target).val();
      if (this.autoEmitModel == true) {
        this.ngModelChange.emit(v);
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

    });

    removeClassName(this.el.nativeElement, ["sa-hidden"]);
  }

  ngOnChanges(changes) {
   
    if (!changes.firstChange) {
      let val;
      if (changes.defaultVal != null && changes.defaultVal !== undefined) {
        val = changes.defaultVal.currentValue;
      }
      //console.log('ngOnChanges-val',val)
      if (val == null || val === undefined) val = "";
      $(this.el.nativeElement)
        .val(val)
        .trigger("change");
    }
  }
}

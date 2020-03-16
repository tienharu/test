import {Directive, ElementRef, OnInit, Output, EventEmitter, Input, OnChanges} from '@angular/core';
import 'bootstrap-slider/dist/bootstrap-slider.min.js';
@Directive({
  selector: '[smartSlider]'
})
export class SmartSliderDirective implements OnInit, OnChanges {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);
  @Output() onSelectedChange = new EventEmitter<string[]>();
  @Input() defaultVal: string="";
  constructor(private el : ElementRef) { }

  ngOnInit(){
    let el = $(this.el.nativeElement);
    el.bootstrapSlider();
    el.on("change", (e: any) => {
      let v = $(e.target).val();
      if (this.ngModelChange) {
        this.ngModelChange.emit(v);
      }
      if (this.onSelectedChange) {
        this.onSelectedChange.emit(v);
      }
    })
    if (this.defaultVal !="") {
      el.bootstrapSlider('setValue', this.defaultVal)
    }
  }
  ngOnChanges(changes) {
   
    if (!changes.firstChange) {
      let val;
      if (changes.defaultVal != null && changes.defaultVal !== undefined) {
        val = changes.defaultVal.currentValue;
      }
      if (val == null || val === undefined) val = "";
      let el = $(this.el.nativeElement);
      el.bootstrapSlider();
      el.bootstrapSlider('setValue', this.defaultVal)
    }
  }
}

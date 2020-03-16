import {Directive, ElementRef, OnInit, EventEmitter, Output, Input, OnChanges} from '@angular/core';

@Directive({
  selector: '[smartTimepicker]'
})
export class SmartTimepickerDirective implements OnInit, OnChanges{
  @Input() options : any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);
  constructor(private el: ElementRef) { }

  ngOnInit(){
    import('bootstrap-timepicker/js/bootstrap-timepicker.min.js').then(()=>{
      this.render();
    })
  }


  render(){
    $(this.el.nativeElement).timepicker(this.options || {});
    this.el.nativeElement.value = "";

    $(this.el.nativeElement).on("change",(e)=>{
      if(this.ngModelChange){
        this.ngModelChange.emit(e.currentTarget.value);
      }
    })

    if(this.el.nativeElement.attributes["ng-reflect-model"].value)
    {
      $(this.el.nativeElement)
        .val(this.el.nativeElement.value)
        .trigger("change");
    }
  }

  ngOnChanges(changes) {
   console.log(` ngOnChanges: ${JSON.stringify(changes)}`)
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

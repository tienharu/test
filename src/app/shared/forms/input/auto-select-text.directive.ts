import { Directive, ElementRef, OnInit } from "@angular/core";
declare var $: any;
@Directive({
  selector: "[autoSelectText]"
})
export class AutoSelectTextDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    $(this.el.nativeElement).on("focus", function() {
      setTimeout(()=> {
        (this).select();
      }, 50);
    });
  }
}

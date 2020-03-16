import { Component, OnInit, AfterViewInit, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { ProgramService } from '@app/core/services/program.service';
import { ProgramModel } from '@app/core/models/program.model';
import { ProgramList } from '@app/core/common/static.enum';

declare var $: any;

@Component({
  selector: 'sa-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit, AfterViewInit {
  currentYear: number = new Date().getFullYear();
  openedPrograms: Array<ProgramModel> = [];
  listenFunc: Function;
  private $menu: any;
  constructor(
    private programService: ProgramService,
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer,
  ) {
    var self = this;
    this.listenFunc = renderer.listen(elementRef.nativeElement, 'click', (event) => {
      var styleMasterDetail = event.target.classList.contains('styleMasterDetail');
      var id = event.target.getAttribute('styleMasterDetail');
      if (event.target.classList.contains('styleMasterDetail-close-tab')) {
        this.closeProgram(id);
        $(window.parent.document).find("#tabs>li[id=" + id + "]>a>i").trigger("click")
        $(window.parent.document).find("iframe[id=" + id + "]").remove();
        $(window.parent.document).find("#tabs>li[id=" + id + "]").remove();
      } else {
        var styleMasterDetailTabs = $(window.parent.document).find("#tabs>li.styleMasterDetail-active-tab");
        if (styleMasterDetailTabs.length) {
          var programs = this.programService.openedPrograms;
          this.programService.programsClicked.emit(ProgramList.Style_Master.valueOf());
          styleMasterDetailTabs.each(function (tab, item) {
            var itemId = item.getAttribute('styleMasterDetail'),
              url = item.getAttribute('url');
            itemId = parseInt(itemId);
            var existed = programs.find(function (p, index) {
              return p.id === itemId;
            });
            
            if (!existed) {
              self.programService.addStyleMasterDetailPrograms(new ProgramModel(itemId, 'Style Master Detail', url, false));
            }
            styleMasterDetailTabs.remove();
          });
        }
      }
    });
  }

  ngOnInit() {
    this.$menu = $('#navLeftMenu');
    this.programService.getOpenedPrograms.subscribe(
      (programs: Array<ProgramModel>) => {
        // console.log('subscribe getOpenedPrograms', programs);
        this.openedPrograms = programs;
      }
    );
    this.programService.refreshOpenedPrograms();
  }

  ngAfterViewInit() {
    this.programService.addAnimation();
  }

  activeProg(id) {
    this.programService.ActiveMenu(id);
    this.$menu.find("li.active").removeClass("active");
    this.$menu.find("li[id=" + id + "]").addClass("active");
  }
  closeProgram(id: number) {
    this.programService.closeOpenedPrograms(id);
    // if (this.openedPrograms.length > 0) {
    //   this.router.navigate([this.openedPrograms[0].url]);
    // } else {
    //   this.router.navigate(['/home']);
    // }
  }

  closeAllPrograms() {
    this.programService.closeAllOpenedPrograms();
    $(window.parent.document).find("#tabs>li").remove();
  }

  onChange(event) {
    let scale = event.target.value;
    // console.log(event.target.value);
    // console.log($("#drlZomm option:selected" ).text());
    $("body").css("-moz-transform", `scale(${scale}, ${scale})`);
    $("body").css("zoom", `${scale}`);
    $("body").css("zoom", `${scale * 100}%`);
  }

}

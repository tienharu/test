import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { ProgramService } from "@app/core/services";

@Component({
  selector: "sa-route-breadcrumbs",
  template: `
    <ol class="breadcrumb">
      <li *ngFor="let item of items">{{ item }}</li>
    </ol>
  `,
  styles: []
})
export class RouteBreadcrumbsComponent implements OnInit, OnDestroy {
  public items: Array<string> = [];
  private sub;
  private $menu: any;

  constructor(private router: Router, private programService:ProgramService) {}


  ngOnInit() {
    setTimeout(() => {
      this.refreshBreakcrumb();
    }, 1000);
    // this.sub = this.router.events
    //   .pipe(filter(e => e instanceof NavigationEnd))
    //   .subscribe(v => {
    //     this.refreshBreakcrumb();
    //   });

    this.sub = this.programService.programsClicked
      .subscribe(
        (id: any) => {
          this.refreshBreakcrumb();
        }
      );
    // this.extract(this.router.routerState.root)
    // this.sub = this.router.events.pipe(
    //   filter(e => e instanceof NavigationEnd)
    // )

    //   .subscribe(v => {
    //     this.items = [];
    //     this.extract(this.router.routerState.root)
    //   });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  refreshBreakcrumb() {
    setTimeout(() => {
      this.$menu = $("#navLeftMenu");
      this.items = [];
      var fOpen = this.$menu.find("li.open");
      if (fOpen) {
        console.log(fOpen)
        //level 1
        var lv1 = $(fOpen[0]).find("span.menu-item-parent");
        if (lv1) {
          let t=$(lv1[0]).text().trim();
          if(t!=''){
            this.items.push(t);
          }
        }
        //level 2
        var lv2 = $(fOpen).find("li.open>a.second-level-nav");
        if(lv2.length==0){
          //if level 2 are programs
          lv2 = $(fOpen).find("li.active>a");
        }
        if (lv2) {
          let t=$(lv2[0]).text().trim();
          if(t!=''){
            this.items.push(t);
          }
        }

        //level 3
        var lv3 = $(fOpen).find("li.active>a.third-level-nav");
        
        if (lv3) {
          let t=$(lv3[0]).text().trim();
          if(t!=''){
            this.items.push(t);
          }
        }
      }
    }, 200);
  }

  extract(route) {
    let pageTitle = route.data.value["pageTitle"];
    if (pageTitle && this.items.indexOf(pageTitle) == -1) {
      this.items.push(route.data.value["pageTitle"]);
    }
    if (route.children) {
      route.children.forEach(it => {
        this.extract(it);
      });
    }
  }
}

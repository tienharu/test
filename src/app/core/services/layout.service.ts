import { Component, OnInit, Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { config } from '@app/core/smartadmin.config';
import { NotificationService } from "@app/core/services/notification.service";
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

const store = {
  smartSkin: localStorage.getItem('sm-skin') || config.smartSkin,
  skin: config.skins.find((_skin) => {
    return _skin.name == (localStorage.getItem('sm-skin') || config.smartSkin)
  }),
  skins: config.skins,
  // fixedHeader: localStorage.getItem('sm-fixed-header') == 'true',
  // fixedNavigation: localStorage.getItem('sm-fixed-navigation') == 'true',
  // fixedRibbon: localStorage.getItem('sm-fixed-ribbon') == 'true',
  // fixedPageFooter: localStorage.getItem('sm-fixed-page-footer') == 'true',
  fixedHeader: true,
  fixedNavigation: true,
  fixedRibbon: true,
  fixedPageFooter: true,
  insideContainer: localStorage.getItem('sm-inside-container') == 'true',
  rtl: localStorage.getItem('sm-rtl') == 'true',
  menuOnTop: localStorage.getItem('sm-menu-on-top') == 'true',
  colorblindFriendly: localStorage.getItem('sm-colorblind-friendly') == 'true',

  shortcutOpen: false,
  isMobile: (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())),
  device: '',

  mobileViewActivated: false,
  menuCollapsed: false,
  menuMinified: false,
};


@Injectable()
export class LayoutService {
  isActivated: boolean;
  smartSkin: string;

  store: any;

  private subject: Subject<any>;
  isfixedNavigation = new EventEmitter<boolean>();
  isMenuOnTop = new EventEmitter<boolean>();

  trigger(t:any=null) {
    this.processBody(this.store,t);
    this.subject.next(this.store)
  }

  subscribe(next, err?, complete?) {
    return this.subject.subscribe(next, err, complete)
  }

  constructor(private notificationService: NotificationService, private router: Router) {
    this.subject = new Subject();
    this.store = store;
    this.trigger(2);

    fromEvent(window, 'resize').
      pipe(
        debounceTime(100),
        map(() => {
          this.trigger()
        })
      )
      .subscribe()
  }


  onSmartSkin(skin) {
    this.store.skin = skin;
    this.store.smartSkin = skin.name;
    this.dumpStorage();
    this.trigger()
  }


  onFixedHeader() {
    this.store.fixedHeader = !this.store.fixedHeader;
    if (this.store.fixedHeader == false) {
      this.store.fixedRibbon = false;
      this.store.fixedNavigation = false;

      this.isfixedNavigation.emit(false);
    }
    this.dumpStorage();
    this.trigger();
  }


  onFixedNavigation() {
    this.store.fixedNavigation = !this.store.fixedNavigation;

    if (this.store.fixedNavigation) {
      this.store.insideContainer = false;
      this.store.fixedHeader = true;
    } else {
      this.store.fixedRibbon = false;
    }
    this.dumpStorage();
    this.trigger();

    this.isfixedNavigation.emit(this.store.fixedNavigation);
  }


  onFixedRibbon() {
    this.store.fixedRibbon = !this.store.fixedRibbon;
    if (this.store.fixedRibbon) {
      this.store.fixedHeader = true;
      this.store.fixedNavigation = true;
      this.store.insideContainer = false;
    }
    this.dumpStorage();
    this.trigger();
  }


  onFixedPageFooter() {
    this.store.fixedPageFooter = !this.store.fixedPageFooter;
    this.dumpStorage();
    this.trigger();
  }


  onInsideContainer() {
    this.store.insideContainer = !this.store.insideContainer;
    if (this.store.insideContainer) {
      this.store.fixedRibbon = false;
      this.store.fixedNavigation = false;
    }
    this.dumpStorage();
    this.trigger();
  }


  onRtl() {
    this.store.rtl = !this.store.rtl;
    this.dumpStorage();
    this.trigger();
  }


  onMenuOnTop() {
    this.store.menuOnTop = !this.store.menuOnTop;
    this.dumpStorage();
    this.trigger();

    this.isMenuOnTop.emit(this.store.menuOnTop);
  }


  onColorblindFriendly() {
    this.store.colorblindFriendly = !this.store.colorblindFriendly;
    this.dumpStorage();
    this.trigger();
  }

  onCollapseMenu(value?) {
    if (typeof value !== 'undefined') {
      this.store.menuCollapsed = value
    } else {
      this.store.menuCollapsed = !this.store.menuCollapsed;
    }

    this.trigger();
  }


  onMinifyMenu() {
    this.store.menuMinified = !this.store.menuMinified;
    this.trigger();
  }

  onShortcutToggle(condition?: any) {
    if (condition == null) {
      this.store.shortcutOpen = !this.store.shortcutOpen;
    } else {
      this.store.shortcutOpen = !!condition;
    }

    this.trigger();
  }


  dumpStorage() {
    localStorage.setItem('sm-skin', this.store.smartSkin);
    localStorage.setItem('sm-fixed-header', this.store.fixedHeader);
    localStorage.setItem('sm-fixed-navigation', this.store.fixedNavigation);
    localStorage.setItem('sm-fixed-ribbon', this.store.fixedRibbon);
    localStorage.setItem('sm-fixed-page-footer', this.store.fixedPageFooter);
    localStorage.setItem('sm-inside-container', this.store.insideContainer);
    localStorage.setItem('sm-rtl', this.store.rtl);
    localStorage.setItem('sm-menu-on-top', this.store.menuOnTop);
    localStorage.setItem('sm-colorblind-friendly', this.store.colorblindFriendly);
  }

  factoryReset() {
    this.notificationService.smartMessageBox({
      title: "<i class='fa fa-refresh' style='color:green'></i> Factory Reset Settings",
      content: "Would you like to clear all your saved widgets and clear LocalStorage?",
      buttons: '[No][Yes]'
    }, (ButtonPressed) => {
      if (ButtonPressed == "Yes" && localStorage) {
        localStorage.clear();
        location.reload();
      }
    });
  }

  pageReset() {
    let url = this.router.url;
    this.router.navigate([url]);
    location.reload();
  }

  processBody(state, t:any=null) {
    let $body = $('body');
    $body.removeClass(state.skins.map((it) => (it.name)).join(' '));
    $body.addClass(state.skin.name);

    if(t){
      setTimeout(() => {
        $("#logo img").attr('src', state.skin.logo);
        $("#logo_left img").attr('src', state.skin.logo_left);
      }, 500);
    }
    else{
      $("#logo img").attr('src', state.skin.logo);
        $("#logo_left img").attr('src', state.skin.logo_left);
    }
    

    $body.toggleClass('fixed-header', state.fixedHeader);
    $body.toggleClass('fixed-navigation', state.fixedNavigation);
    $body.toggleClass('fixed-ribbon', state.fixedRibbon);
    $body.toggleClass('fixed-page-footer', state.fixedPageFooter);
    $body.toggleClass('container', state.insideContainer);
    $body.toggleClass('smart-rtl', state.rtl);
    $body.toggleClass('menu-on-top', state.menuOnTop);
    $body.toggleClass('colorblind-friendly', state.colorblindFriendly);
    $body.toggleClass('shortcut-on', state.shortcutOpen);


    state.mobileViewActivated = $(window).width() < 979;
    $body.toggleClass('mobile-view-activated', state.mobileViewActivated);
    if (state.mobileViewActivated) {
      $body.removeClass('minified');
    }

    if (state.isMobile) {
      $body.addClass("mobile-detected");
    } else {
      $body.addClass("desktop-detected");
    }

    if (state.menuOnTop) $body.removeClass('minified');


    if (!state.menuOnTop) {
      $body.toggleClass("hidden-menu-mobile-lock", state.menuCollapsed);
      $body.toggleClass("hidden-menu", state.menuCollapsed);
      $body.removeClass("minified");
    } else if (state.menuOnTop && state.mobileViewActivated) {
      $body.toggleClass("hidden-menu-mobile-lock", state.menuCollapsed);
      $body.toggleClass("hidden-menu", state.menuCollapsed);
      $body.removeClass("minified");
    }

    if (state.menuMinified && !state.menuOnTop && !state.mobileViewActivated) {
      $body.addClass("minified");
      $body.removeClass("hidden-menu");
      $body.removeClass("hidden-menu-mobile-lock");
    }
  }
}

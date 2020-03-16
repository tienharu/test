import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
})
export class Error404Component implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
    $('.center-loading').hide();
  }

  goBack(): void {
    this.location.back();
  }

}

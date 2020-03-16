import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '@app/core/services/auth.service';

declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
    
  }
}

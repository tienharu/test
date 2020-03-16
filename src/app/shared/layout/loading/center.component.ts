import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgramService } from '@app/core/services/program.service';
import { ProgramModel } from '@app/core/models/program.model';

declare var $: any;

@Component({
  selector: 'sa-loading-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.css'],
})
export class LoadingCenterComponent implements OnInit, AfterViewInit {
  
  constructor() { }

  ngOnInit() {
   
  }

  ngAfterViewInit() {
  }

}

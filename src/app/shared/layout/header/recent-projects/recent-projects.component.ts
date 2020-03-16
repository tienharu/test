import { Component, OnInit } from '@angular/core';
import { RecentProjectsService } from "@app/shared/layout/header/recent-projects/recent-projects.service";

@Component({
  selector: 'sa-recent-projects',
  templateUrl: './recent-projects.component.html',
  providers: [RecentProjectsService]
})
export class RecentProjectsComponent implements OnInit {
  count: number;
  projects: Array<any>;

  constructor(private projectsService: RecentProjectsService) {

  }

  ngOnInit() {
    this.projects = this.projectsService.getProjects();
    this.count = this.projects.length;
  }

  clearProjects() {
    this.projectsService.clearProjects();
    this.projects = this.projectsService.getProjects();
  }

}

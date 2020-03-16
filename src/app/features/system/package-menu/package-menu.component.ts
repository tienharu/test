import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { AuthService } from '@app/core/services/auth.service';
import { PackageMenuModel } from '@app/core/models/package-menu.model';
import { ProgramService } from '@app/core/services';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { HierarchyMenuModel } from '@app/core/models/hierarchy-menu.model';
import { IActionMapping, ITreeOptions } from 'angular-tree-component';
import { PackageModel } from '@app/core/models/package.model';
import { BasePage } from '@app/core/common/base-page';
@Component({
  selector: 'sa-package-menu',
  templateUrl: './package-menu.component.html',
  styleUrls: ['./package-menu.component.css']
})
export class PackageMenuComponent extends BasePage implements OnInit {
  options: any;
  loggedUser: any = {};
  detailInfo: PackageMenuModel;//to push package menu when insert
  packageId: number = 0;//selected on left grid
  packageMenuMapping: PackageMenuModel[] = [];
  menuPackageNodes: HierarchyMenuModel[] = [];
  @ViewChild('treeMenuMapping') treeMenuMapping;

  actionMapping: IActionMapping = {
    mouse: {
      click: (treeMenuMapping, node) => this.check(node, !node.data.checked)
    }
  };

  treeViewOptions: ITreeOptions = {
    actionMapping: this.actionMapping,
    idField: 'menu_id',
    displayField: 'menu_name',
    childrenField: 'nodes',
  };

  public check(node, checked) {
    this.updateChildNodeCheckbox(node, checked);
    this.updateParentNodeCheckbox(node.realParent);
  }

  public updateChildNodeCheckbox(node, checked) {
    node.data.checked = checked;
    if (node.children) {
      node.children.forEach((child) => this.updateChildNodeCheckbox(child, checked));
    }
  }

  public updateParentNodeCheckbox(node) {
    if (!node) {
      return;
    }

    let allChildrenChecked = true;
    let noChildChecked = true;

    for (const child of node.children) {
      if (!child.data.checked || child.data.indeterminate) {
        allChildrenChecked = false;
      }
      if (child.data.checked) {
        noChildChecked = false;
      }
    }

    if (allChildrenChecked) {
      node.data.checked = true;
      node.data.indeterminate = false;
    } else if (noChildChecked) {
      node.data.checked = false;
      node.data.indeterminate = false;
    } else {
      node.data.checked = true;
      node.data.indeterminate = true;
    }
    this.updateParentNodeCheckbox(node.parent);
  }

  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private programService: ProgramService,
    private router: Router,
    private route: ActivatedRoute,
    public userService: AuthService,
  ) { super(userService)};

  
  ngOnInit() {
    this.checkPermission(ProgramList.Package_Menu.valueOf())
    this.initDatatable();
    this.getSystemMenus().then(data => {
      this.menuPackageNodes = data;
      console.log(data)
      setTimeout(() => {
        this.treeMenuMapping.treeModel.expandAll();
        //this.selectFirstRow();
      }, 100);
    });
  }

  public translate = function(property: string) {
    return this.otherService.translate(property);
  };


  private getSystemMenus() {
    return new Promise<any[]>(
      (resolve, reject) => {
        this.api.get("menu/btree").subscribe(data => {          
          resolve(data.data);
        });
      }
    );
  }
  private newMethod(): any {
    return "menu/btree/by-company";
  }

  

  private initDatatable() {        
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {     
        this.loadPackageList().then(data => {
          callback({
            aaData: data
          });
        });
      },
      columns: [
        { data: "pack_id", className: "center" },
        { data: "pack_nm" },
      ],
      // scrollY: 553,
      // scrollX: true,
      // paging: false,
      columnDefs: [
        { "width": "100px", "targets": 0 },
        { "width": "auto", "targets": 1 },
      ],
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
          }
        },
        "copy",
        "excel",
        "pdf",
        "print"
      ]
    };
  }

  private loadPackageList() {
    return new Promise<PackageModel[]>(
      (resolve, reject) => {
        this.api.get("/package/list").subscribe(data => {                    
          //console.log(data.data);          
          resolve(data.data);
        });
      }
    );
  }

  private getPackageMenuList(packageId) {
    return new Promise<PackageMenuModel[]>(
      (resolve, reject) => {
        this.api.get("/packagemenu/list-by-package/" + packageId).subscribe(data => {                    
          //console.log(data.data);          
          resolve(data.data);
        });
      }
    );
  }

  

  updateCheckNodes(nodeData) {    
    this.unCheckedAllMenuNodes();
    if (nodeData) {      
      let nodes = nodeData;//.split(',');
      //console.log(this.menuPackageNodes)
      nodes.forEach(node => {
        this.menuPackageNodes.forEach(firstNode => {
          firstNode.nodes.forEach(secondNode => {
            secondNode.nodes.forEach(thirdNode => {
              if (thirdNode.menu_id == node) {
                thirdNode.checked = true;
                secondNode.indeterminate = true;
                firstNode.indeterminate = true;
              }
            });

            if (secondNode.nodes.every(thirdNode => thirdNode.checked)) {
              secondNode.checked = true;
              secondNode.indeterminate = false;
            }
          });

          if (firstNode.nodes.every(secondNode => secondNode.checked)) {
            firstNode.checked = true;
            firstNode.indeterminate = false;
          }
        });
      });
    }
  }

  private unCheckedAllMenuNodes() {
    this.menuPackageNodes.forEach(firstNode => {
      firstNode.nodes.forEach(secondNode => {
        secondNode.nodes.forEach(thirdNode => {
          thirdNode.checked = false;
        });

        secondNode.checked = false;
        secondNode.indeterminate = false;
      });

      firstNode.checked = false;
      firstNode.indeterminate = false;
    });
  }

  private createPackageMenuMapping() {
    this.packageMenuMapping=[];
    this.menuPackageNodes.forEach(firstNode => {
      firstNode.nodes.forEach(secondNode => {
        secondNode.nodes.forEach(thirdNode => {
          if (thirdNode.checked) {
            this.detailInfo = new PackageMenuModel();
            this.detailInfo.menu_id = thirdNode.menu_id;
            this.detailInfo.pack_id = this.packageId;
            console.log(this.detailInfo)
            this.packageMenuMapping.push(this.detailInfo);           
          }
        });
      });
    });
  }

  onRowClick(event) {
    this.packageId = event.pack_id;

    // if (event.menu_id !== Category.MenuIdStart.valueOf()) {
    //   $('.dataTable tbody tr:eq(0)').removeClass('selected');
    // }

    this.getPackageMenuList(this.packageId).then(data => {      
      var node:any=[];
      data.forEach(pm => {   
        node.push(pm.menu_id);
      });
      console.log(node)
      this.updateCheckNodes(node);
    });
  }
  private selectFirstRow() {
    $(".dataTable")
      .DataTable()
      .ajax.reload(() => {
        $('.dataTable tbody tr:eq(0)').click();
        $('.dataTable tbody tr:eq(0)').addClass('selected');
      });
  }

  onSubmit() {
    if(this.packageId==0){
      this.notification.showMessage("error", 'Please select package');
      return;
    }
    this.createPackageMenuMapping();
    console.log(this.packageMenuMapping)
    if (this.packageMenuMapping.length > 0) {
      this.api.post("packagemenu/insert", this.packageMenuMapping).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
        }
      });
    } else {
      this.notification.showMessage("error", "Please select at least one menu for this package");
    }
  }
  

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}

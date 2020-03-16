import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { AuthService } from '@app/core/services/auth.service';
import { AuthorityGroupMenuSettingService } from '@app/core/services/features.services/authority-group-menu-setting.service';
import { AuthorityGroupMenuSettingModel } from '@app/core/models/authority-group-menu-setting.model';
import { HierarchyMenuModel } from '@app/core/models/hierarchy-menu.model';
import { ITreeOptions, TreeNode, IActionMapping } from 'angular-tree-component';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { AuthorityGroupModel } from '@app/core/models/authority-group.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgramService } from '@app/core/services/program.service';
import { BasePage } from '@app/core/common/base-page';
import { I18nService } from '@app/shared/i18n/i18n.service';

@Component({
  selector: 'sa-authority-group-menu-setting',
  templateUrl: './authority-group-menu-setting.component.html',
  styleUrls: ['./authority-group-menu-setting.component.css']
})
export class AuthorityGroupMenuSettingComponent extends BasePage implements OnInit, CanDeactivateGuard {
  options: any;
  loggedUser: any = {};
  detailInfo: AuthorityGroupMenuSettingModel;
  companies:any[] = [];
  authorGroupList:AuthorityGroupModel[] = [];
  authorityGroupId: number = 0;
  authorityGroupMenuMapping: AuthorityGroupMenuSettingModel[] = [];
  menuAuthorityNodes: HierarchyMenuModel[] = [];
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

  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    private authorityGroupMenuSettingService: AuthorityGroupMenuSettingService,
    private programService: ProgramService,
    private router: Router,
    private route: ActivatedRoute,
    public userService: AuthService,
    private i18nService: I18nService
    
  ) { 
    super(userService);
    this.loggedUser = this.userService.getUserInfo();
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Authority_Group_Menu.valueOf())
    this.detailInfo = this.authorityGroupMenuSettingService.getModel();
    this.detailInfo.company_id=this.loggedUser.company_id;
    this.detailInfo.is_system=this.userService.isSystemCompany();
    
    this.getCompanies().then(data =>{
      this.companies.push(...data)
    })
    this.initDatatable();

    this.bindMenuTreeView();

  }
  private getCompanies() {
    let _isSytem = this.userService.isSystemCompany()? 'list' : 'details';
    return new Promise<any>((resolve, reject) => {
      this.api.get(`company/${_isSytem}`).subscribe(data => {         
        resolve(data.data);
      });
    });
  }
  onChangeCompany(){
    this.reloadAuthoGroup();
    this.bindMenuTreeView();
  }

  private getAllPackMenu() {
    return new Promise<any[]>(
      (resolve, reject) => {
        this.api.get(`/menu/btree/by-company?companyId=${this.detailInfo.company_id}`).subscribe(data => {   
         
          resolve(data.data);
        });
      }
    );
  }
bindMenuTreeView(){
  this.getAllPackMenu().then(data => {
    this.menuAuthorityNodes = data;
    setTimeout(() => {
      this.treeMenuMapping.treeModel.expandAll();
      ///this.selectFirstRow();
    }, 100);
  });
}
  private getAuthorityGroupList() {
    return new Promise<AuthorityGroupModel[]>(
      (resolve, reject) => {
        this.api.get(`/authorgroup/list?companyId=${this.detailInfo.company_id}`).subscribe(data => {   
          this.authorGroupList= data.data;                
          resolve(data.data);
        });
      }
    );
  }

  private initDatatable() {        
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {     
        this.getAuthorityGroupList().then(data => {
          callback({
            aaData: data
          });
        });
      },
      columns: [
        { data: "author_group_id", className: "center" },
        { data: "author_group_nm" },
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
            this.bindMenuTreeView();
          }
        },
        "copy",
        "excel",
        "pdf",
        "print"
      ]
    };
  }

  updateCheckNodes(nodeData) {    
    this.unCheckedAllMenuNodes();
    if (nodeData) {      
      let nodes = nodeData.split(',');
      nodes.forEach(node => {
        this.menuAuthorityNodes.forEach(firstNode => {
          firstNode.nodes.forEach(secondNode => {
            secondNode.nodes.forEach(thirdNode => {
              if (thirdNode.menu_id.toString() === node) {
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
    this.menuAuthorityNodes.forEach(firstNode => {
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

  private createAuthorityGroupMenuMapping() {
    this.authorityGroupMenuMapping=[];
    this.menuAuthorityNodes.forEach(firstNode => {
      firstNode.nodes.forEach(secondNode => {
        secondNode.nodes.forEach(thirdNode => {
          if (thirdNode.checked) {
            var menuInfo = new AuthorityGroupMenuSettingModel();
            menuInfo.company_id = this.detailInfo.company_id;
            menuInfo.menu_id = thirdNode.menu_id;
            menuInfo.author_group_id = this.authorityGroupId;
            this.authorityGroupMenuMapping.push(menuInfo);           
          }
        });
      });
    });
  }

  onRowClick(event) {
    this.authorityGroupId = event.author_group_id;

    var selectGroup= this.authorGroupList.filter(x=>x.author_group_id==this.authorityGroupId);
    if(selectGroup.length>0){
      this.updateCheckNodes(selectGroup[0].node);
    }
    else{
      this.updateCheckNodes(null);
    }
    // this.getAuthorityGroupList().then(data => {      
    //   data.forEach(authorityGroup => {   
    //     if (authorityGroup.author_group_id == this.authorityGroupId) {
    //       //console.log(authorityGroup.node)
    //       this.updateCheckNodes(authorityGroup.node);
    //     }
    //   });
    // });

  }


  onSubmit() {
    this.createAuthorityGroupMenuMapping();

    if (this.authorityGroupMenuMapping.length > 0) {
      this.api.post("MenuAuthor/insert", this.authorityGroupMenuMapping).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
        }
      });
    } else {
      this.showNofitication();
    }
  }

  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
  

  private showNofitication() {
    this.notification.smartMessageBox({
      title: "Notification",
      content: "Please select at least one menu for this Authority Group",
      buttons: '[OK]'
    });
  }
  private reloadAuthoGroup() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // this.authorityGroupMenuSettingService.storeTemporaryModel(this.detailInfo);
    return true;
  }

}

//import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component, OnInit, Directive, ElementRef, HostListener, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { UserAuthorityGroupSettingModel } from '@app/core/models/user-authority-group-setting.model';
import { UserMenuModel } from '@app/core/models/user-menu.model';

import { AuthorityGroupModel } from '@app/core/models/authority-group.model';

import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { UserAuthorityGroupSettingService } from '@app/core/services/features.services/user-authority-group-setting.service';
import { UserMenuSettingService } from '@app/core/services/features.services/user-menu-setting.service';
import { AuthService } from '@app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ProgramService } from '@app/core/services/program.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { BasePage } from '@app/core/common/base-page';

@Component({
  selector: 'sa-user-authority-group-setting',
  templateUrl: './user-authority-group-setting.component.html',
  styleUrls: ['./user-authority-group-setting.component.css']
})
export class UserAuthorityGroupSettingComponent extends BasePage implements OnInit, CanDeactivateGuard {
  options: any;
  userMenuDS: any;
  detailInfo: UserAuthorityGroupSettingModel;
  detailUserMenu: UserMenuModel[] = [];
  authorityGroups: AuthorityGroupModel[] = [];
  loggedUser: any = {};
  companies: any[] = [];
  conpanyId: any;
  is_system: boolean = false;

  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    private userAuthorityGroupSettingService: UserAuthorityGroupSettingService,
    public userService: AuthService,
    private UserMenuSettingService: UserMenuSettingService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private programService: ProgramService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef

  ) {
    super(userService);
    this.loggedUser = this.userService.getUserInfo();
  }


  ngOnInit() {
    this.checkPermission(ProgramList.User_Menu_Setting.valueOf())
    this.detailInfo = new UserAuthorityGroupSettingModel();
    this.detailInfo.company_id = this.loggedUser.company_id;
    this.conpanyId = this.loggedUser.company_id;
    this.is_system = this.userService.isSystemCompany();
    this.getCompanies().then(data => {
      this.companies.push(...data)
    })
    this.getAuthorGroup().then(data => {
      this.authorityGroups.push(...data);
    });

    this.initDatatable();
    this.initUserMenuDS(0, 0);

    // setTimeout(() => {
    //   this.selectFirstRow();
    // }, 500);
  }
  private getCompanies() {
    let _isSytem = this.userService.isSystemCompany() ? 'list' : 'details';
    return new Promise<any>((resolve, reject) => {
      this.api.get(`company/${_isSytem}`).subscribe(data => {
        resolve(data.data);
      });
    });
  }
  onChangeCompany(comId) {
    if (comId != this.detailInfo.company_id) {
      this.detailInfo.company_id = comId;
      this.getAuthorGroup().then(data => {
        console.log("getAuthorGroup", data);
        this.authorityGroups = [];
        this.authorityGroups.push(...data);
      });
      this.reloadUserDatatable();
      $(".userMenuDS").DataTable().clear().draw();
      // this.detailInfo.author_group_id = 0;
    }
  }
  ngAfterViewInit() {
    this.renderer.listen(this.elRef.nativeElement, 'click', (e) => {
      var target = e.target;
      if (target.checked != undefined) {
        //console.log(e);
        //console.log(target.className + "|" + target.checked);
        if (this.isAllCheck(target.className)) {
          $('._' + target.className).attr('checked', true);
        }
        else {
          $('._' + target.className).attr('checked', false);
        }
      }
    });
  }

  isAllCheck(oClassName) {
    var elements = $('.' + oClassName);
    for (var i = 0; i < elements.length; i++) {
      if (!elements[i].checked) return false
    }
    return true;
  }

  isOneCheck(event, oclassName) {
    var elements = $('.' + oclassName);
    for (var i = 0; i < elements.length; i++) {
      elements[i].checked = $('._' + oclassName)[0].checked;
    }
  }


  onAuthorGroupChanged(authorGroupId) {
    if (this.detailInfo.user_id == undefined || this.detailInfo.user_id <= 0) {
      return;
    }
    this.detailInfo.author_group_id = authorGroupId;
    this.cdr.detectChanges();
    this.onReloadUserAuthorGroupMenu(this.detailInfo.user_id, authorGroupId);
  }

  onReloadUserAuthorGroupMenu(userId, authorGroupId) {
    console.log('onReloadUserAuthorGroupMenu', this.detailInfo.company_id)
    var url = `usermenu/list/masuser/${userId}/${authorGroupId}/${this.detailInfo.company_id}`;

    var table = $('.userMenuDS').DataTable();
    this.getUserMenuSouces(url).then(data => {
      // console.log('getUserMenuSouces',data)         
      this.detailUserMenu = data; // loading new data to detailUserMenu.      
      table.clear();
      table.rows.add(this.detailUserMenu).draw();
    });
  }

  private getUserMenuSouces(url) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(url).subscribe(data => {
        resolve(data.data);
      });
    });
  }

  private getAuthorGroup() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`authorgroup/list?companyId=${this.detailInfo.company_id}`).subscribe(data => {
        console.log("authorgroup", data.data)
        resolve(data.data);
      });
    });
  }


  // The rigth gridData of screen.
  private initUserMenuDS(userId, authorGrupId) {
    this.userMenuDS = {
      dom: "Bfrtip",
      columns: [
        {
          data: (data, type, dataToSet) => {
            return data.rank;
          },
          class: "center",
          width: "50px"
        },
        {
          data: (data, type, dataToSet) => {
            return data.menu_id;
          },
          class: "center menu-id",
          width: "80px"
        },
        {
          data: (data, type, dataToSet) => {
            return data.menu_name;
          },
          width: "300px"
        },
        {
          data: (data, type, dataToSet) => {
            var isCheck = data.search_yn ? "checked" : "unchecked";
            return "<input class='search_yn' type='checkbox' " + isCheck + "   />";
          },
          className: "center",
          width: "100px"
        },
        {
          data: (data, type, dataToSet) => {
            var isCheck = data.save_yn ? "checked" : "unchecked";
            return "<input class='save_yn' type='checkbox' " + isCheck + "  />";
          },
          className: "center", width: "100px"
        },
        {
          data: (data, type, dataToSet) => {
            var isCheck = data.delete_yn ? "checked" : "unchecked";
            return "<input class='delete_yn' type='checkbox' " + isCheck + "   />";
          },
          className: "center", width: "100px"
        },
        {
          data: (data, type, dataToSet) => {
            var isCheck = data.posting_yn ? "checked" : "unchecked";
            return "<input class='posting_yn' type='checkbox' " + isCheck + "  />";
            //return "<input class='posting_yn checkbox style-0' type='checkbox' " + isCheck + " />"
          },
          className: "center", width: "100px"
        }
      ],
      scrollY: 350,
      paging: false,
      ordering: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            console.log("detail", this.detailInfo);
            if(dt.rows().count() > 0){
              this.onReloadUserAuthorGroupMenu(this.detailInfo.user_id, this.detailInfo.author_group_id);     
            }        
          }
        },
        "copy",
        "excel",
        "pdf",
        "print"
      ]
    };
  }


  // The left gridData of screen.
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.api.get(`menuauthor/masuser/list?companyId=${this.detailInfo.company_id}`).subscribe(data => {
          callback({
            aaData: data.data
          });
        });
      },
      columns: [
        { data: "user_id", class: "center" },
        { data: "user_nm" },
        { data: "full_nm" },
        { data: "author_group_nm" }
      ],
      // scrollY: 350,
      // paging: false,
      buttons: [
        // {
        //   text: '<i class="fa fa-refresh" title="Refresh"></i>',
        //   action: (e, dt, node, config) => {
        //     dt.ajax.reload();
        //     this.detailInfo = new UserAuthorityGroupSettingModel();
        //   }
        // },
        "copy",
        "excel",
        "pdf",
        "print"
      ]
    };
  }

  onRowClick(event) {
    setTimeout(() => {
      this.detailInfo = event;
      //console.log('onRowClick',this.detailInfo)

      if (this.detailInfo.author_group_id == null) {
        //user didnt grant to any author-group->set to 1st author-group
        this.detailInfo.author_group_id = this.authorityGroups[0].author_group_id;
        //when this.detailInfo.author_group_id setted->onAuthorGroupChanged will fired then run onReloadUserAuthorGroupMenu
        //this case no need to call onReloadUserAuthorGroupMenu...
      }
      else {
        this.onReloadUserAuthorGroupMenu(this.detailInfo.user_id, this.detailInfo.author_group_id);
      }
    }, 100);
  }


  onClose() {
    this.programService.closeCurrentProgram();
  }

  onSubmit() {
    //var _dataSource = this.detailUserMenu;   
    if (this.detailUserMenu.length == 0) {
      this.notification.showMessage('error', 'Please select a user');
      return;
    }
    var dataSource: UserMenuModel[] = [];
    console.log('onSubmit detailInfo', this.detailInfo)
    $('table.userMenuDS tbody>tr').each((idx, item) => {
      //console.log(item); 
      let menuId = $(item).find('.menu-id').text();
      let search_yn = $(item).find('input.search_yn')[0].checked;
      let save_yn = $(item).find('input.save_yn')[0].checked;
      let delete_yn = $(item).find('input.delete_yn')[0].checked;
      let posting_yn = $(item).find('input.posting_yn')[0].checked;
      //console.log(search_yn[0].checked,save_yn[0].checked); 

      let menuInfo = new UserMenuModel();
      menuInfo.company_id = this.detailInfo.company_id;
      menuInfo.user_id = this.detailInfo.user_id;
      menuInfo.author_group_id = this.detailInfo.author_group_id;
      menuInfo.menu_id = parseInt(menuId);
      menuInfo.search_yn = search_yn;
      menuInfo.save_yn = save_yn;
      menuInfo.delete_yn = delete_yn;
      menuInfo.posting_yn = posting_yn;
      //console.log('onSubmit menuInfo',menuInfo)
      dataSource.push(menuInfo);

      // var _handleUserMenuDS =  new UserMenuModel();
      // $('td', this).each( ()=> {
      //   if ($(this).find('input[type="checkbox"]').length > 0) {
      //     var _chkBox_className = $(this).find('input[type="checkbox"]')[0].className;
      //     var _chkBox_flag = $(this).find('input[type="checkbox"]')[0].checked ? 1 : 0;            
      //     if (_handleUserMenuDS.hasOwnProperty(_chkBox_className)) {
      //       _handleUserMenuDS[_chkBox_className] = _chkBox_flag
      //     }
      //   }

      //   // Checking menu_id has on datasource
      //   if ($(this).find('span[ref="text"]').length > 0) {
      //       var _className = $(this).find('span')[0].className;         
      //       if (_className === 'menu_id_' + idx){
      //            let _menu_id = parseInt($('.' + _className).text());
      //           // console.log(typeof _menu_id + ':' + _menu_id  + "\n") ;
      //          console.log(_dataSource[idx].menu_id + ':' +  _menu_id) ;
      //            if(_dataSource[idx].menu_id === _menu_id){
      //                //console.log(_menu_id)                     
      //                //console.log(_dataSource[idx]);
      //                _handleUserMenuDS.user_id = this.detailInfo.user_id;
      //                _handleUserMenuDS.company_id = this.detailInfo.company_id;
      //                _handleUserMenuDS.menu_id = _dataSource[idx].menu_id;
      //                _handleUserMenuDS.author_group_id = this.detailInfo.author_group_id;//parseInt($('.selectAuthorGroupId').val());
      //            }                   

      //       }            
      //   }
      // });  
      //console.log(_handleUserMenuDS); 
      //dataSource.push(_handleUserMenuDS);       
    });

    console.log(dataSource);
    if (dataSource.length > 0) {
      this.api.post("usermenu/insert", dataSource).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          //$('#btnSubmit').attr("disabled", true);
          this.notification.showMessage("success", data.data.message);
          //this.resetPageLoad();
          //this.reloadDatatable();
        }
      });
    }
    else {
      this.notification.showMessage('error', 'Please select at least one menu');
    }
  }


  private reloadUserDatatable() {
    $(".userAuthorGroup").DataTable().ajax.reload();
  }


  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

}

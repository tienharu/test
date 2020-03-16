import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, NotificationService, ProgramService } from "@app/core/services";
import { SearchingService } from "@app/core/services/searching.service";
import { BasePage } from "@app/core/common/base-page";
import { SearchingModel } from "@app/core/models/searching.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
declare var $: any;

@Component({
  selector: 'sa-search-bar',
  templateUrl: './search.component.html'
})
export class SearchBarComponent extends BasePage {
  @ViewChild("popupResultSearch") popupResultSearch;
  modalRef: BsModalRef;
  SearchingModel: SearchingModel
  keyword: string
  constructor(
    private router: Router,
    public userService: AuthService,
    private notificationService: NotificationService,
    private searchingService: SearchingService,
    public programService: ProgramService,
    private modalService: BsModalService,
  ) {
    super(userService);
  }

  ngOnInit() {

  }

  searchMobileActive = false;

  toggleSearchMobile() {
    this.searchMobileActive = !this.searchMobileActive;
    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  onSubmit() {
    // this.router.navigate(['/miscellaneous/search']);
    this.keyword = $('#keyword').val()
    if (this.keyword == null || this.keyword.length < 3) {
      this.notificationService.showMessage("error", "keyword must contain at least 3 characters");
    } else {
      this.openPopup()
    }

  }
  
  changeKeyword(value) {
    if (value.length == 0) {
      this.searchingService.stopIntervalHighLight()
      localStorage.removeItem('idInterval');
      $(`#page iframe`).each(function () {
        $(this).contents().unmark()
      })
    }
  }

  openPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupResultSearch, config);
  }
  closePopup() {
    this.modalRef && this.modalRef.hide();
  }
}
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserMasterService } from '@app/core/services/features.services/user-master.service';
import { SharingGroupService } from '@app/core/services/features.services/sharing-group.service';
import { BasePage } from '@app/core/common/base-page';
import { AuthService } from '@app/core/services/auth.service';
import { SharingDataModel } from '@app/core/models/base.model';

@Component({
  selector: 'sa-sharing-info',
  templateUrl: './sharing-info.component.html',
  styleUrls: ['./sharing-info.component.css']
})
export class SharingInfoComponent extends BasePage implements OnInit {

  constructor(
    private userMasterService: UserMasterService,
    public groupSharingService: SharingGroupService,
    public userService: AuthService
  ) {
    super(userService);
  }
  listGroup: any = [];
  listUser: any = [];
  listGroupAndUser: any = [];
  sharingDataModel: SharingDataModel;
  listSharing: SharingDataModel[] = [];

  updateData: any = [];
  options: {}
  @Input() classBootstrap: any;
  //This is selected data for update
  @Input() defaultVal: SharingDataModel[];
  @Input() sharedData: SharingDataModel[];
  @Output() outputData: EventEmitter<any> = new EventEmitter();
  ngOnInit() {
    this.options = {
      placeholder: "Select an option",
      multiple: true,
      // closeOnSelect: false,
    }
    // if(this.sharedData){
    //   this.sharedData.forEach(e => {
    //     this.updateData.push(e.sharing_type+"-"+e.sharing_to_id)
    //   });
    // }
    // else{
    //   this.updateData.push("1-1")
    //   this.updateData.push("1-3")
    // }

    if (!this.classBootstrap) {
      this.classBootstrap = 'col-md-11'
    }

    this.getGroup().then(data => {
      this.listGroup.push(...data);
    });

    this.getUser().then(data => {
      this.listUser.push(...data);
    });
    // setTimeout(() => {
    //   $("#e1").val(this.updateData).trigger("change");
    // }, 500);
    // $(document).ready(function () {

      // $('.select2-results__options').each(function () {
      //   var el = $(this)
      //   console.log('-----------------')

      //   console.log(el)
      //   // el.css('margin-left', '10px')
      // })

      // $('#e1').on('select2:select', function (e) {
      //   var data = e.params.data;
      //   console.log('-----------------')
      //   console.log(data);
      //   console.log(e);
      // });
    // });
  }
  
  ngOnChanges(changes) {
    console.log(changes);
    if (!changes.firstChange) {
      let val;
      if (changes.defaultVal != null && changes.defaultVal !== undefined) {
        val = changes.defaultVal.currentValue;
      }
      if (val == null || val === undefined) val = [];
      $("#e1").val(val).trigger("change");
    }
  }

  getGroup() {
    return this.groupSharingService.listSharingGroup(this.loggedUser.company_id);
  }
  getUser() {
    return this.userMasterService.listUsers();
  }
  getOutSelect(value) {
    // let arr = SharingDataModel[]
    this.listSharing = [];
    for (let item of value) {
      this.sharingDataModel = new SharingDataModel()
      let info = item.split('-')
      this.sharingDataModel.sharing_type = info[0]
      this.sharingDataModel.sharing_to_id = info[1]
      this.listSharing.push(this.sharingDataModel)
    }
    this.outputData.emit(this.listSharing);
    console.log(this.listSharing);
  }
  clearAll() {
    $("#e1").find('option').prop("selected", false);
    $("#e1").trigger('change');
    this.listSharing = [];
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { NotificationService, CRMSolutionApiService } from '@app/core/services';
import { MultiLanguageService } from '@app/core/services/mutil-language.service';
require('jquery-jcrop/js/jquery.Jcrop.min.js');
@Component({
  selector: 'sa-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
  avatarModel:any={};
  imageSelected:boolean=false;
  avatarSrc:any;
  options: any;
  userInfo:any;
  public languagesSupported: any;
  constructor(private api: CRMSolutionApiService,private notificationService: NotificationService,public userService: AuthService,private langService: MultiLanguageService) { }

  ngOnInit() {
    this.userInfo=this.userService.getUserInfo();

    this.langService.initLanguageSupported().then(data => {
      this.languagesSupported = data;   
    });  
  }

  onFileChange(event){
    this.imageSelected=false;
    this.avatarModel ={};
    if($('#avatarImage').data('Jcrop'))
    {
      $('#avatarImage').data('Jcrop').destroy();
    }
      
    console.log('onFileChange',event)
    const reader = new FileReader();
      if(event.target.files && event.target.files.length){
        let file = event.target.files[0];     
        reader.readAsDataURL(file);
        reader.onload = () => {
        //this.avatarSrc=event.target.value;
         $('#avatarImage').attr('src', reader.result);    
          this.imageSelected=true;
          this.renderJCrop();
          this.avatarModel.avatar_data = { file_name: file.name, file_type: file.type, value: reader.result.toString() };
          
        }
      }
  }

  renderJCrop(){
   $("#avatarImage").Jcrop({
      onChange: this.onChange,
      onSelect: this.onSelect,
      onRelease: this.onRelease,
      aspectRatio: 1 / 1,
      minSize:[100,100],
      maxSize:[400,400],
      setSelect: [ 50, 50, 300, 300 ],
    },  ()=> {
    });
  }
  onChange = (crop)=> {
    //console.log('onChange',crop)
    // this.cropActions.cropChange(
    //   crop, this.storeId
    // )
  };

  onSelect = (crop)=> {
    //console.log('onSelect',crop)
    this.avatarModel.crop=crop;
    
  };
  onRelease = (crop)=> {
    //console.log('onRelease',crop)
    //this.isActive = false;
    this.avatarModel.crop=null;
  };
  onSaveInfo(){
    this.avatarModel.user_id=this.userInfo.user_cd;
    this.avatarModel.company_id=this.userInfo.company_id;
    console.log('avatarModel',this.avatarModel)
    this.api.post('/user/change-avatar',this.avatarModel).subscribe(data=>{
      if(data.error){
        this.notificationService.showMessage('error',data.error.message)
      }
      else{
        $("img.user-avatar").attr('src',data.avatar);
        this.notificationService.showMessage('success','Avatar changed successfully')
      }
    })
  }
  cancelChanges(){
    this.imageSelected=false;
    this.avatarModel ={};
    if($('#avatarImage').data('Jcrop'))
    {
      $('#avatarImage').data('Jcrop').destroy();
    }
    $('#avatarImage').removeAttr("style")
  }
}

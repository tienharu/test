import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { RequestJoinModel } from '@app/core/models/request-join.model';
import { AuthService, NotificationService, CRMSolutionApiService } from '@app/core/services';
import { PasswordValidation } from '@app/core/common/password-validation';
import { SubmitModel } from '@app/core/models/submit.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  model: RequestJoinModel;
  submitted = false;
  loginSuccess: boolean = false;
  errMessage: string = '';
  isReadOnly: boolean = true;

  // bsModalRef: BsModalRef;
  // public termsAgreed = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: CRMSolutionApiService,
    // private modalService: BsModalService,
    private authService: AuthService,
    private notification: NotificationService) {
  }

  ngOnInit() {
    this.model = new RequestJoinModel();
    this.createForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  createForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]],
      fullname: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(3)]]
    }, {
        validator: PasswordValidation.MatchPassword
      });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // call API.
    this.api.post("submit/insert", this.model).subscribe(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.data.message);
      } else {
        this.notification.showMessage("success", data.data.message);

        let submit_id = 0;
        let username = '';
        let email ='';
        let user_id = 0;
        submit_id = data.data.submit_id;

        this.getSubmitDetails(submit_id).then(data => {
          // console.log(data[0].username);
          username = data[0].username;
          email = data[0].email;
          user_id = data[0].user_id;

          if (submit_id !== 0 && user_id !== 0 && username) {
            this.router.navigate(['/auth/register-company'], { queryParams: { submit_id: submit_id, user_id: user_id, username: username, email: email } });
          } else {
            this.notification.showMessage("error", "There is some error occurred");
          }
        });
      }
    });
  }

  onCancel() {
    this.submitted = false;
    this.registerForm.reset();
  }

  onPasswordInputChanged() {
    this.isReadOnly = this.model.password.length > 0 ? false : true;
  }

  private getSubmitDetails(submit_id) {
    return new Promise<SubmitModel[]>(
      (resolve) => {
        this.api.get(`/submit/details/${submit_id}`).subscribe(data => {
          resolve(data.data);
        });
      }
    );
  }

  // openModal(event, template: TemplateRef<any>) {
  //   event.preventDefault();
  //   this.bsModalRef = this.modalService.show(template);
  // }

  // onTermsAgree(){
  //   this.termsAgreed = true
  //   this.bsModalRef.hide()
  // }

  // onTermsClose(){
  //   this.bsModalRef.hide()
  // }

}

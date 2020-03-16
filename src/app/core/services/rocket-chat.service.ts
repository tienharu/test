import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { throwError } from 'rxjs/internal/observable/throwError';
import { map, catchError } from 'rxjs/operators';
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { ProgramService } from '@app/core/services/program.service';
import { CommonFunction } from '../common/common-function';
import * as moment from 'moment'
@Injectable()
export class RocketChatService {
  rocketUserStorageKey: string = "rocketChat.user";
  meteorLoginTokenStorageKey: string = "Meteor.loginToken";
  meteorUserIdUserStorageKey: string = "Meteor.userId";
  meteorLoginExpiredStorageKey :string = 'Meteor.loginTokenExpires';

  public rocketUser: any;
  constructor(
    private api: CRMSolutionApiService
  ) { }

  login(username: string, password: string): Observable<any> {
    return this.api.post("api/v1/chat_client/login", { user: username, password: password }).pipe(
      map(rs => {
        if (rs.success) {
          localStorage.setItem(this.rocketUserStorageKey, JSON.stringify(rs.data.data));
          localStorage.setItem(this.meteorLoginTokenStorageKey, rs.data.data.authToken);
          localStorage.setItem(this.meteorUserIdUserStorageKey, rs.data.data.userId);
          var expired =  moment().add('month', 3).subtract('day',1).format('MM/DD/YYYY');
          var date = new Date(expired);
          localStorage.setItem(this.meteorLoginExpiredStorageKey, date.toString());
          return { status: true };
        }
        else {
          return { status: false, message: rs.error.message };
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.api.post("api/v1/chat_client/register", user).pipe(
      map(data => {
        if (data.success) {
          return { status: true };
        }
        else {
          return { status: false, message: data.error.message };
        }
      })
    );
  }

  update(user: any): Observable<any> {
    var rocketUser = this.getRocketUserInfo();
    var params = {
      userInfo: user,
      xUserId: rocketUser.userId,
      xAuthToken: this.getToken()
    }
    return this.api.post("api/v1/chat_client/update", params).pipe(
      map(data => {
        if (data.success) {
          return { status: true };
        }
        else {
          return { status: false, message: data.error };
        }
      })
    );
  }

  unreadMessage(): any {
    var rocketUser = this.getRocketUserInfo();
    var params = {
      xUserId: rocketUser.userId,
      xAuthToken: this.getToken()
    }
    return new Promise<any>((resolve, reject) => {
      this.api.post(`api/v1/chat_client/get-subscriptions`, params).subscribe(data => {
        resolve(data.data);
      });
    });
  }

  logout(): void {
    localStorage.removeItem(this.rocketUserStorageKey);
    localStorage.removeItem(this.meteorLoginTokenStorageKey);
    localStorage.removeItem(this.meteorUserIdUserStorageKey);
    localStorage.removeItem(this.meteorLoginExpiredStorageKey);
    this.rocketUser = undefined;
  }

  getRocketUserInfo(): any {
    if (this.rocketUser) {
      //console.log('getUserInfo',this.user)
      return this.rocketUser;
    }
    var data = localStorage.getItem(this.rocketUserStorageKey);
    if (data != undefined && data != null) {
      let d = JSON.parse(data);
      try {
        if (d) {
          this.rocketUser = d;
          return this.rocketUser;
        }
      }
      catch (x) {
        console.error(x);
      }
    }
    return {};
  }

  getToken(): any {
    var data = localStorage.getItem(this.rocketUserStorageKey);
    if (data != undefined && data != null) {
      let d = JSON.parse(data);
      return d.authToken;
    }
    return '';
  }
}

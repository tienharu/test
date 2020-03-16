import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { ProgramService } from '@app/core/services/program.service';
import { LoggedUserInfoModel } from '@app/core/models/logged-user-info.model';
import { MultiLanguageService } from './mutil-language.service';
import { CommonFunction } from '../common/common-function';
@Injectable()
export class AuthService {	
	
	userStorageKey: string = "auth.user";
	public user: any;

	constructor(private api: CRMSolutionApiService,
		private programService: ProgramService,
		private langService:MultiLanguageService) { }	
		
	isSystemCompany(){
		let userInfo= this.getUserInfo();
		if(userInfo.is_system_company){
			return userInfo.is_system_company==true;
		}
		return false;
	}
	isAuthenticated(){
		let token= this.getToken();
		return token!=undefined && token!='';
	}
	login(username: string, password: string): Observable<any> {
		return this.api.post("auth/login", { username: username, password: password }).pipe(
			map(data => {
				if (data.success) {
					localStorage.setItem(this.userStorageKey, JSON.stringify(data.data));					
					return { status: true };
				}
				else {
					return { status: false, message: data.error.message };
				}
			})
		);
	}

	logout(): void {
		localStorage.removeItem(this.userStorageKey);
		this.langService.removeAllLanguageKeys();
		this.programService.closeAllOpenedPrograms();
		this.user=undefined;
	}

	getUserInfo():any {
		if(this.user){
			//console.log('getUserInfo',this.user)
			return this.user;
		}
		var data = localStorage.getItem(this.userStorageKey);
		if (data!=undefined && data != null) {
			let d=JSON.parse(data);
			try{
				if(d.user_info){
					var decodedString = CommonFunction.b64DecodeUnicode(d.user_info);
					this.user = JSON.parse(decodedString);
					//console.log('getUserInfo localStorage',this.user);
					return this.user;
				}
			}
			catch(x){
				console.error(x);
			}
			
		}
		return {};
	}
	getToken():any {
		var data = localStorage.getItem(this.userStorageKey);
		if ( data!=undefined && data != null) {
			let d=JSON.parse(data);
			return d.token;
		}
		return '';
	}

	  public checkPermission(menuId) {
		return new Promise<any>((resolve, reject) => {
		  this.api.get(`/auth/CheckPermission?menuId=${menuId}`).subscribe(data => {
			resolve(data);
		  });
		});
		}
		

		// public GetListFavMenuByUser(companyId,userId) {
		// 	return new Promise<any>((resolve, reject) => {
		// 		this.api.get(`/auth/get-fav-menu-by-user?companyId=${companyId}&userId=${userId}`).subscribe(data => {
		// 		resolve(data);
		// 		});
		// 	});
		// 	}

		public GetListFavMenuByUser(companyId,userId) {
			return new Promise<any>((resolve, reject) => {
				this.api.get(`/auth/GetListFavMenuByUser?companyId=${companyId}&userId=${userId}`).subscribe(data => {
				resolve(data);
				});
			});
			}
}

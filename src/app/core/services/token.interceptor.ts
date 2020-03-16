import { Injectable } from "@angular/core";
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from '@env/environment';
import { NotificationService } from "./notification.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(private router: Router, private notificationService: NotificationService) { }
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		// add authorization header with jwt token if available
		if (request.url.indexOf(environment.SERVER_API_URL) < 0) {
			return next.handle(request);
		}
		else if (request.url.indexOf("login") > 0 && request.url.indexOf("chat_client") < 0) {
			return next.handle(request).pipe(
				catchError((err: HttpErrorResponse) => {
					if (err.status == 0 || err.status >= 500 || !err.ok) {
						this.notificationService.showMessage("error", "System error: " + err.statusText);
					}
					return Observable.throw(err);
				})
			);
		}
		else {
			let currentUser = JSON.parse(localStorage.getItem("auth.user"));
			if (currentUser && currentUser.token) {
				var pageUrl=window.location.href;
				if(pageUrl && pageUrl.indexOf("#")>0){
					pageUrl=pageUrl.substring(pageUrl.indexOf("#")+2)//remove #/
				}

				//console.log(`Page ${pageUrl}`);
				request = request.clone({
					setHeaders: {
						Authorization: `Bearer ${currentUser.token}`,
						RequestedUrl: pageUrl
					}
				});
			}
			return next.handle(request).pipe(
				catchError((err: HttpErrorResponse) => {
					if (this.router.url !== "/login" && err.status === 401) {
						console.log('JwtInterceptor 401 status')
						this.router.navigate(["/auth/login"]);
					}
					if (err.status == 403) {
						this.router.navigate(["/error/error403"]);
					}
					// if (err.status >= 500) {
					// 	this.notificationService.showMessage("error", "System error occurred, please try again later...");
					// }
					return throwError(err);
				})
			);
		}
	}
}

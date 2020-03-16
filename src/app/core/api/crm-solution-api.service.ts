import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { throwError } from 'rxjs/internal/observable/throwError';
import { map, delay, catchError } from 'rxjs/operators';
import { environment } from "@env/environment";
import { NotificationService } from '@app/core/services/notification.service';


@Injectable()
export class CRMSolutionApiService {

	constructor(private http: HttpClient) { }

	private getUrl(url) {
		if (url.indexOf('/') == 0) {
			url = url.substring(1);
		}
		var domain = window.location.protocol + "//" + window.location.host;

		if (!environment.SERVER_API_URL.startsWith('http://')) {
			environment.SERVER_API_URL = domain + environment.SERVER_API_URL;
		}
		return environment.SERVER_API_URL + url;
	}


	public download(url): Observable<any> {
		const httpOptions = {
			responseType: 'blob' as 'json'
		};
		return this.http.get(this.getUrl(url), httpOptions);
	}

	public download_file(fileName): Observable<any> {
		let _url = this.getUrl("/wwwroot/" + fileName);
		let headers = new HttpHeaders();
		headers.append("Accept", `application/vnd.iman.v${1}+json, application/json, text/plain, */*`);
		headers.append("App-Version", '1');
		return this.http.get(_url, { headers: headers, responseType: 'blob'}).pipe(
			map((data: any) => (data)),
			catchError(this.handleError)
		);
	}
	
	public download_image(fileName): Observable<any> {
		let _url = this.getUrl(`api/v1/order/static-file/download?filePath=${fileName}`);
		// let headers = new HttpHeaders();
		// headers.append("Accept", `application/vnd.iman.v${1}+json, application/json, text/plain, */*`);
		// headers.append("App-Version", '1');
		// headers.append("Access-Control-Allow-Origin", "*");
		return this.http.get(_url, { responseType: 'blob'}).pipe(
			map((data: any) => (data)),
			catchError(this.handleError)
		);
	}

	public download_post(url: string, body: any): Observable<any> {
		let _url = this.getUrl(url);
		let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		let data = JSON.stringify(body);
		return this.http.post(_url, data, { headers: headers, responseType: 'blob' as 'json' }).pipe(
			map((data: any) => (data)),
			catchError(this.handleError)
		);
	}

	public get(url): Observable<any> {
		return this.http.get(this.getUrl(url)).pipe(
			delay(10),
			map((data: any) => (data)),
			catchError(this.handleError)
		);
	}

	public post(url: string, body: any): Observable<any> {
		let _url = this.getUrl(url);
		let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		let data = JSON.stringify(body);
		// console.log(_url+'\n'+data);
		return this.http.post(_url, data, { headers: headers }).pipe(
			map((data: any) => (data)),
			catchError(this.handleError)
		);
	}

	public patch(url: string, body: any): Observable<any> {
		let _url = this.getUrl(url);
		let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		let data = JSON.stringify(body);
		// console.log(_url+'\n'+data);
		return this.http.patch(_url, data, { headers: headers }).pipe(
			map((data: any) => (data)),
			catchError(this.handleError)
		);
	}

	public put(url: string, body: any): Observable<any> {
		let _url = this.getUrl(url);
		let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		let data = JSON.stringify(body);
		// console.log(_url+'\n'+data);
		return this.http.put(_url, data, { headers: headers }).pipe(
			map((data: any) => (data)),
			catchError(this.handleError)
		);
	}

	public delete(url: string): Observable<any> {
		let _url = this.getUrl(url);
		let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		// console.log(_url+'\n'+data);
		return this.http.delete(_url, { headers: headers }).pipe(
			map((data: any) => (data)),
			catchError(this.handleError)
		);
	}

	private handleError(error: any) {
		// In a real world app, we might use a remote logging infrastructure
		// We'd also dig deeper into the error to get a better message
		let errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		let errObj = { error: { code: -999, message: errMsg } };
		if (error.status != 401) {
			let _notification = new NotificationService();
			_notification.showMessage('error', errMsg)
		}
		return throwError(errObj);
	}
}



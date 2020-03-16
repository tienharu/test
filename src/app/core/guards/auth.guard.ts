import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProgramService } from '@app/core/services/program.service';
import { ProgramModel } from '@app/core/models/program.model';
import { AuthService } from '../services/auth.service';
// import { Store, select } from '@ngrx/store';
// import { Observable } from 'rxjs';
// import { map, take } from 'rxjs/operators';

// import * as fromAuth from '../store/auth';

@Injectable()
export class AuthGuard implements CanActivate {
	// constructor(
	//   private store: Store<fromAuth.AuthState>) {
	//   }

	// canActivate(): Observable<boolean> {

	//   return this.store.pipe(
	//     select(fromAuth.getLoggedIn),
	//     map(authed => {
	//       if (!authed) {
	//         this.store.dispatch(new fromAuth.LoginRedirect('/dashboard'));
	//         return false;
	//       }

	//       return true;
	//     }),
	//     take(1)
	//   );
	// }

	constructor(private router: Router,
				private authService: AuthService,
				private programService: ProgramService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.authService.isAuthenticated()) {
			//return this.programService.addOpenedPrograms(new ProgramModel(route.data.pageTitle, state.url));
			//this.programService.resetActiveByUrl(state.url)
			//$('.center-loading').hide();
			return true;
		}
		
		// console.log('Not authorized...')
		// not logged in so redirect to login page
		this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
		return false;
	}
}

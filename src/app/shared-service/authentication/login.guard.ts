import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class LoginGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean |
        UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (localStorage.getItem('at')) {
            this.router.navigate(['/home/dashboard']);
            return false;
        } else {
            return true;
        }
    }
}

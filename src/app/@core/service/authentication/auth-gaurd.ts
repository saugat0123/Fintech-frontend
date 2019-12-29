import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {LocalStorageUtil} from '../../utils/local-storage-util';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        if (LocalStorageUtil.getStorage().at) {
            return true;
        } else {
            this.router.navigate(['']);
            return false;
        }
    }
}

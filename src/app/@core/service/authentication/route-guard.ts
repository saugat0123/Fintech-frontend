import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {LocalStorageUtil} from '../../utils/local-storage-util';
import {Injectable} from '@angular/core';
import {ObjectUtil} from '../../utils/ObjectUtil';
import {NbMenuItem} from '@nebular/theme';
import {FeatureMenuService} from '../../../feature/FeatureMenuService';
import {RoleType} from '../../../feature/admin/modal/roleType';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  menus: NbMenuItem[] = [];


  constructor(private router: Router, private menuService: FeatureMenuService) {
  }

  async canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot) {
    if (LocalStorageUtil.getStorage().at) {
      if (!ObjectUtil.isEmpty(LocalStorageUtil.getStorage().menus)) {
        return this.permissionCheck(next, state, LocalStorageUtil.getStorage().menus);
      } else {
        await this.menuService.getMenus().toPromise().then(res => {
              this.menus = [...res.detail];
              const storage = LocalStorageUtil.getStorage();
              if (storage.roleType === RoleType[RoleType.COMMITTEE]) {
                const tempMenu = {
                  id: null,
                  title: 'Pull',
                  link: '/home/loan/pull',
                  icon: 'arrowhead-down-outline'
                };
                this.menus.push(tempMenu);
              }
              storage.menus = this.menus;
              LocalStorageUtil.setStorage(storage);


            },
            (error) => {
              console.log(error);
            });

        return this.permissionCheck(next, state, this.menus);
      }
    } else {
      this.router.navigate(['']);
      return false;
    }
  }


  permissionCheck(next: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot, menus) {
    const mapLink = [];
    menus.forEach(f => {
      mapLink.push(f.link);
      if (!ObjectUtil.isEmpty(f.children)) {
        if (f.children.length > 0) {
          f.children.forEach(c => {
            mapLink.push(c.link);
          });
        }
      }
    });
    let url = state.url;
    if (state.url.toString().includes('?')) {
      url = state.url.split('?')[0];
    }
    const linkList = mapLink.filter(f => f === url);
    if (linkList.length > 0) {
      return true;
    }
    this.router.navigate(['home/error']);
    return false;
  }

}

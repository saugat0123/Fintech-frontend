import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {RouteConst} from '../model/RouteConst';
import * as CryptoJS from 'crypto-js';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {UserService} from '../../admin/component/user/user.service';
import {User} from '../../admin/modal/user';
import {CustomerType} from '../../customer/model/customerType';

@Injectable({
    providedIn: 'root'
})
export class RouterUtilsService {
    currentUserLocalStorage = LocalStorageUtil.getStorage().userId;

    constructor(
        private router: Router,
        private userService: UserService
    ) {
    }

    reloadRoute(submitUrl: string, returnUrl: string) {
        this.router.navigateByUrl(submitUrl).then(value => {
            if (value) {
                this.router.navigate([returnUrl], {});
            }
        });
    }

    reloadCadProfileRoute(cadDocumentId) {
        this.router.navigateByUrl(RouteConst.ROUTE_DASHBOARD).then(value => {
            if (value) {
                this.router.navigate([RouteConst.ROUTE_OFFER_PROFILE],
                    {
                        queryParams: {
                            cadDocumentId: cadDocumentId,
                        }
                    });
            }
        });
    }

    reloadCadProfileRouteWithActiveTab(cadDocumentId, tabId) {
        this.router.navigateByUrl(RouteConst.ROUTE_DASHBOARD).then(value => {
            if (value) {
                this.router.navigate([RouteConst.ROUTE_OFFER_PROFILE],
                    {
                        state: {data: null, tabId: tabId},
                        queryParams: {
                            cadDocumentId: cadDocumentId,
                        }
                    });
            }
        });
    }


    routeSummaryWithStateAndEncryptPath(model) {
        this.router.navigate([RouteConst.ROUTE_CAD_SUMMARY, this.encryptUrl(model.id)],
            {state: {data: model}});

    }

    routeSummaryAndEncryptPathID(id) {
        this.router.navigate([RouteConst.ROUTE_CAD_SUMMARY, this.encryptUrl(id)]);

    }

    routeToCustomer(id, customerType, associateId) {
        if (CustomerType[customerType] === CustomerType.INDIVIDUAL) {
            this.router.navigate(['/home/customer/profile/' + associateId], {
                queryParams: {
                    customerType: customerType,
                    customerInfoId: id
                }
            });
        } else if (CustomerType[customerType] === CustomerType.INSTITUTION) {
            this.router.navigate(['/home/customer/company-profile/' + associateId],
                {queryParams: {id: id, customerType: customerType, companyInfoId: associateId, customerInfoId: id}});
        }

    }

    loadProfileWithState(cadDocumentId, model) {
        this.router.navigate([RouteConst.ROUTE_OFFER_PROFILE],
            {
                state: {data: model},
                queryParams: {
                    cadDocumentId: cadDocumentId,
                },

            });
    }

    routeOnConditionProfileOrSummary(cadDocumentId, model) {
        this.userService.getLoggedInUser().subscribe((res: any) => {
            const user: User = res.detail;
            if (user.role.roleType === 'CAD_LEGAL') {
                if (user.role.id.toString() === model.cadCurrentStage.toRole.id.toString()) {
                    this.loadProfileWithState(cadDocumentId, model);
                } else {
                    this.routeSummaryWithStateAndEncryptPath(model);
                }
            } else {
                if (user.id.toString() === model.cadCurrentStage.toUser.id.toString()) {
                    this.loadProfileWithState(cadDocumentId, model);
                } else {
                    this.routeSummaryWithStateAndEncryptPath(model);
                }
            }
        });

    }

    encryptUrl(id) {
        const i = CryptoJS.AES.encrypt(id.toString(), 'id').toString();
        return i;
    }
}

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {RouteConst} from '../model/RouteConst';
import * as CryptoJS from 'crypto-js';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';

@Injectable({
    providedIn: 'root'
})
export class RouterUtilsService {
    currentUserLocalStorage = LocalStorageUtil.getStorage().userId;

    constructor(
        private router: Router
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
        console.log(this.currentUserLocalStorage.toString());
        console.log(model.cadCurrentStage.toUser.id.toString());
        if (this.currentUserLocalStorage.toString() === model.cadCurrentStage.toUser.id.toString()) {
            this.loadProfileWithState(cadDocumentId, model);
        } else {
            this.routeSummaryWithStateAndEncryptPath(model);
        }
    }

    encryptUrl(id) {
        const i = CryptoJS.AES.encrypt(id.toString(), 'id').toString();
        return i;
    }
}

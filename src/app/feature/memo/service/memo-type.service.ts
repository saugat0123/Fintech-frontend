import {IBaseService} from '../../../core/IBaseService';
import {MemoType} from '../model/memoType';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {RestApiService} from '../../../@core/service/authentication/rest-api.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MemoTypeService implements IBaseService<MemoType> {
    static API = 'v1/memos/types';

    private type: MemoType;

    public constructor(private http: HttpClient, private restApiService: RestApiService) {
    }

    clear() {
        this.type = undefined;
    }

    clearALL() {
    }

    delete(id: number) {
        const deleteApi = `${MemoTypeService.API}/${id}`;

        const resource = this.restApiService.modifyRestUrl(deleteApi);

        return this.http.delete(resource.url, {headers: resource.header});
    }

    get(): MemoType {
        return this.type;
    }

    getAll(): Observable<any> {
        const api = `${MemoTypeService.API}/all`;
        const resource = this.restApiService.modifyRestUrl(api);

        return this.http.get(resource.url, {headers: resource.header});
    }

    getPagination(search: string, page: number = 1, size: number = 20): Observable<any> {

        let api: string;

        if (search === null || search === undefined) {
            api = `${MemoTypeService.API}?page=${page}&size=${size}`;
        } else {
            api = `${MemoTypeService.API}?page=${page}&&size=${size}&searchParams=${search}`;
        }

        const resource = this.restApiService.modifyRestUrl(api);
        return this.http.get(resource.url, {headers: resource.header});
    }

    save(t: MemoType): Observable<any> {

        const resource = this.restApiService.modifyRestUrl(MemoTypeService.API);

        return this.http.post(resource.url, t, {headers: resource.header});
    }

    set(type: MemoType) {
        this.type = type;
    }

    update(t: MemoType): Observable<any> {
        const api = `${MemoTypeService.API}/${t.id}`;
        const resource = this.restApiService.modifyRestUrl(api);

        return this.http.put(resource.url, t, {headers: resource.header});
    }

}

import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from './utils/api/ApiUtils';

/**
 * API are expected to be developed in rest pattern
 *
 * save = POST: /v1/memos
 * update = PUT: /v1/memos{id}
 * delete = DELETE: /v1/memos/{id}
 * getAll = GET: /v1/memos/all?search -- add filter option in it
 * getPaginationWithSearchString = GET: /v1/memos?search=?page=1&size=10
 * getPaginationWithSearchObj = POST: /v1/memos/list?page=1&size=10
 */
export abstract class BaseService<T> {

    private obj: T;
    private objs: T[];

    protected constructor(protected http: HttpClient) {
    }

    protected abstract getApi(): string;

    public  save(obj: T): Observable<any> {
        const req = ApiUtils.getRequest(this.getApi());

        return this.http.post(req.url, obj, {headers: req.header});
    }

    public saveAny(obj: any): Observable<any> {
        const req = ApiUtils.getRequest(this.getApi());

        return this.http.post(req.url, obj, {headers: req.header});
    }

    public saveAll(obj: T[]): Observable<any> {
        const req = ApiUtils.getRequest(this.getApi());

        return this.http.post(req.url, obj, {headers: req.header});
    }

    public saveWithFile(obj: T): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(this.getApi());
        return this.http.post(req.url, obj, {headers: req.header});
    }

    public update(id: number, obj: T): Observable<any> {
        const api = `${this.getApi()}/${id}`;
        const req = ApiUtils.getRequest(api);

        return this.http.put(req.url, obj, {headers: req.header});
    }

    public updateWithFile(id: number, obj: T): Observable<any> {
        const api = `${this.getApi()}/${id}`;
        const req = ApiUtils.getRequestWithFileSupport(api);

        return this.http.put(req.url, obj, {headers: req.header});
    }

    public detail(id: number): Observable<any> {
        const api = `${this.getApi()}/${id}`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }

    public getOneWithSearch(searchObj: any): Observable<any> {
        const api = `${this.getApi()}/one`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public delete(id: number): Observable<any> {
        const api = `${this.getApi()}/${id}`;

        const req = ApiUtils.getRequest(api);

        return this.http.delete(req.url, {headers: req.header});
    }

    public getAll(): Observable<any> {

        const api = `${this.getApi()}/all`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    public getAllWithSearch(searchObj: any): Observable<any> {

        const api = `${this.getApi()}/all`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public getPaginationWithSearch(search: string, page: number = 1, size: number = 20): Observable<any> {
        let api: string;

        if (search === null || search === undefined) {
            api = `${this.getApi()}?page=${page}&size=${size}`;
        } else {
            api = `${this.getApi()}?page=${page}&&size=${size}&${search}`;
        }

        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }

    public getPaginationWithSearchObject(searchObj: any, page: number = 1, size: number = 20): Observable<any> {
        const api = `${this.getApi()}/list?page=${page}&size=${size}`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public download(searchObj: Object): Observable<any> {
        const api = `${this.getApi()}/csv`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public getStatus(): Observable<any> {
        const api = `${this.getApi()}/statusCount`;

        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    public getListWithSearchObject(searchObj: any): Observable<any> {
        const api = `${this.getApi()}/list/filtered`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public getCalendar(): Observable<any> {
        const api = `v1/calendar`;

        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }


    public set(obj: T): void {
        this.obj = obj;
    }

    public get(): T {
        return this.obj;
    }

    public clear(): void {
        this.obj = undefined;
    }
}

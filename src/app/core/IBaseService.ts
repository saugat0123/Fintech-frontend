import {Observable} from 'rxjs';

export interface IBaseService<T> {
    save(t: T): Observable<any>;

    update(t: T): Observable<any>;

    delete(id: number);

    getAll(): Observable<any>;

    getPagination(search: string, page: number, size: number): Observable<any>;

    set(type: T);

    get(): T;

    clear();

    clearALL();
}

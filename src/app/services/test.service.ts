import { Request } from '@models/request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private sessionEndpoint: string = 'reqres.in';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public test(object: any | FormData): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${environment.api}/${this.sessionEndpoint}/users`, object);
  }

  public getRequests(pageControl?: PageControl, filters?): Observable<ApiResponsePageable<any>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<any>>(`${environment.api}/${this.sessionEndpoint}/users?${paginate}${filterParams}`);
}

}

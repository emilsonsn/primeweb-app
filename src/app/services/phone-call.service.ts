import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { PhoneCall } from '@models/phone-call';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhoneCallService {

  private sessionEndpoint: string = 'phone-call';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<PhoneCall>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<PhoneCall>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public post(phoneCall: PhoneCall | FormData): Observable<ApiResponse<PhoneCall>> {
    return this._http.post<ApiResponse<PhoneCall>>(`${environment.api}/${this.sessionEndpoint}/create`, phoneCall);
  }

  public patch(id: number, phoneCall: PhoneCall | FormData): Observable<ApiResponse<PhoneCall>> {
    return this._http.post<ApiResponse<PhoneCall>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, phoneCall);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }
}

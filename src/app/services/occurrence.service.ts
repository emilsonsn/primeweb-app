import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Occurrence } from '@models/occurrence';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OccurrenceService {

  private sessionEndpoint: string = 'occurrence';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Occurrence>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Occurrence>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public post(occurrence: Occurrence | FormData): Observable<ApiResponse<Occurrence>> {
    return this._http.post<ApiResponse<Occurrence>>(`${environment.api}/${this.sessionEndpoint}/create`, occurrence);
  }

  public resendEmail(id: number): Observable<ApiResponse<Occurrence>> {
    return this._http.post<ApiResponse<Occurrence>>(`${environment.api}/${this.sessionEndpoint}/resend-email/${id}`, {});
  }
  
  public patch(id: number, occurrence: Occurrence | FormData): Observable<ApiResponse<Occurrence>> {
    return this._http.post<ApiResponse<Occurrence>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, occurrence);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }
}

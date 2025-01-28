import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {

  private sessionEndpoint: string = 'technician';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<any>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<any>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public getById(id: number): Observable<ApiResponse<any>> {
    return this._http.get<ApiResponse<any>>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public post(technician: any | FormData): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${environment.api}/${this.sessionEndpoint}/create`, technician);
  }

  public patch(id: number, technician: any | FormData): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, technician);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public changeStatus(technician: any | FormData): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${environment.api}/${this.sessionEndpoint}/change-status`, technician);
  }
}

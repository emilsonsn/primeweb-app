import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private sessionEndpoint: string = 'client';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<any>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<any>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public post(client: any | FormData): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${environment.api}/${this.sessionEndpoint}/create`, client);
  }

  public patch(id: number, client: any | FormData): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, client);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public deletePhone(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/phone/${id}`);
  }

  public deleteEmail(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/email/${id}`);
  }

  // Contract
  public postContract(client_id : number, contract: any | FormData): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${environment.api}/${this.sessionEndpoint}/${client_id}/add-contract`, contract);
  }

  public deleteContract(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/contract/${id}`);
  }


}

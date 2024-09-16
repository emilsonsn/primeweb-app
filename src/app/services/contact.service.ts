import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Contact } from '@models/contact';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private sessionEndpoint: string = 'contact';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Contact>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Contact>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public post(contact: Contact | FormData): Observable<ApiResponse<Contact>> {
    return this._http.post<ApiResponse<Contact>>(`${environment.api}/${this.sessionEndpoint}/create`, contact);
  }

  public patch(id: number, contact: Contact | FormData): Observable<ApiResponse<Contact>> {
    return this._http.post<ApiResponse<Contact>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, contact);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Segment } from '@models/segment';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SegmentService {

  private sessionEndpoint: string = 'segment';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getAll(): Observable<ApiResponsePageable<Segment>> {
    return this._http.get<ApiResponsePageable<Segment>>(`${environment.api}/${this.sessionEndpoint}/all`);
  }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Segment>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Segment>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public post(segment: Segment | FormData): Observable<ApiResponse<Segment>> {
    return this._http.post<ApiResponse<Segment>>(`${environment.api}/${this.sessionEndpoint}/create`, segment);
  }

  public patch(id: number, segment: Segment | FormData): Observable<ApiResponse<Segment>> {
    return this._http.post<ApiResponse<Segment>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, segment);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }
}

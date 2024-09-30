import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import {Observable} from "rxjs";
import {ApiResponse} from "@models/application";
import {Request} from "@models/request";
import {OrderData} from "@models/dashboard";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private readonly _http: HttpClient
  ) {}

  getCards(): Observable<ApiResponse<any>> {
    return this._http.get<ApiResponse<any>>(`${environment.api}/dashboard/cards`);
  }

}

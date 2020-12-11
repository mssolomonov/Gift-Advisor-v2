import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PopularityService {

  constructor(private http: HttpClient) { }

  saveCount(id: number) {
    return this.http.post(`http://10.0.2.15:30163/popularity/${id}`, null)
  }
}

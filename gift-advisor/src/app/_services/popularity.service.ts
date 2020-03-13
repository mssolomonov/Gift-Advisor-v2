import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PopularityService {

  constructor(private http: HttpClient) { }

  getCount(id: number) {
    return this.http.get(`http://localhost:8080/popularity`, {
      params: {id: id.toString()}
    })
  }
  saveCount(id: number) {
    return this.http.post(`http://localhost:8080/popularity/${id}`, null)
  }

  updateCount(id: number) {
    return this.http.put(`http://localhost:8080/popularity`, {
      params: {id: id.toString()}
    })
  }
}

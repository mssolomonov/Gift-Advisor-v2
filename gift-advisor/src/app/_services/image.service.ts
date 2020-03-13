import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Tag} from "../_model/tag";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getImage(file: string) {
    return this.http.get(`http://localhost:8080/image/${file}`,  { responseType: 'blob'})
  }
  saveImage(file: File, id: string){
    let form = new FormData();
    form.append('file', file);
    return this.http.post<any>(`http://localhost:8080/image`, form, {
      params: {id: id.toString()},
      reportProgress: true,
    });
  }
}

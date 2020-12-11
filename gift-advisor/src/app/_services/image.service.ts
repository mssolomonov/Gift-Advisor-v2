import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  saveImage(file: File, id: string){
    let form = new FormData();
    form.append('file', file);
    return this.http.post<any>(`http://10.0.2.15:30163/image`, form, {
      params: {id: id.toString()},
      reportProgress: true,
    });
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Tag} from "../_model/tag";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private http: HttpClient) {
  }

  getList() {
    return this.http.get<Tag[]>(`http://10.0.2.15:30163/tags`).pipe(
      map(tag =>  tag.map(tag => {
        tag.name = tag.name.trim();
        return tag
      })));
  }
}

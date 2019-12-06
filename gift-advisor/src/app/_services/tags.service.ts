import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Gift} from "../_model/gift";
import {Tag} from "../_model/tag";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private http: HttpClient) {
  }

  getList() {
    return this.http.get<Tag[]>(`http://localhost:8080/tags`).pipe(
      map(tag =>  tag.map(tag => {
        tag.name = tag.name.replace(/\s/g,'');
        return tag
      })));
  }
}

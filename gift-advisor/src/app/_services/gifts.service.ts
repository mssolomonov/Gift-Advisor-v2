import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Gift} from "../_model/gift";

@Injectable({
  providedIn: 'root'
})
export class GiftsService {

  constructor(private http: HttpClient) { }

  get(id: number){
    return this.http.get<Gift>(`http://10.0.2.15:30163/gift/${id}`);
  }

  add(gift: Gift){
    return this.http.post(`http://10.0.2.15:30163/gift/add`, gift);
  }

  update(gift: Gift){
    return this.http.put(`http://10.0.2.15:30163/gift/update`, gift);
  }

  delete(id: number){
    return this.http.delete(`http://10.0.2.15:30163/gift/${id}`);
  }

  getUserGift(username: string) {
    return this.http.get<Gift[]>(`http://10.0.2.15:30163/gifts/${username}`);
  }

  getGifts(tags: string[], username: string, from, to: number, sort: string){

    return this.http.get<Gift[]>(`http://10.0.2.15:30163/gift/search`, {
      params: {
        'tags': tags,
        'username': username,
        'from': from.toString(),
        'to': to.toString(),
        'sort': sort,
      }});
  }

  getAll() {
    return this.http.get(`http://10.0.2.15:30163/gifts`);
  }
}

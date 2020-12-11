import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../_model/user";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(user: User){
    return this.http.post(`http://10.0.2.15:30163/users/reg`, user);
  }

}

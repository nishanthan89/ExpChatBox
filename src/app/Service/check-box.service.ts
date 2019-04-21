import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class CheckBoxService {

  
  constructor(private http: HttpClient) { }
  baseUrl: string = 'http://localhost:61895/api';

  Login(data: any){
    return this.http.post<any>(this.baseUrl+'/Account/Login', data)
  }

  getUserList() {
    return this.http.get<any>(this.baseUrl+'/chat/GetAllResource')
  }

  getChatHistory(loggedinuserid) {
    return this.http.post<any>(this.baseUrl+'/chat/getchathistory', loggedinuserid)
  }
  
  getChatEachHistory(data :any) {
    return this.http.post<any>(this.baseUrl+'/chat/getchateachhistory', data)
  }
  
  addAnotherUser(newUserId) {
    return this.http.post<any>(this.baseUrl+'/chat/AddnewUser', newUserId)
  }
}
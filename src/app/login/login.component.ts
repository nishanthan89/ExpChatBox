import { Component, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { CheckBoxService } from '../service/check-box.service';
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private service: CheckBoxService, private cookie:CookieService) { }
  model: any = {};
  isLogin = false;
  isLoginFail = false;
  ngOnInit() {
  }
//for call the login service
  login() {
    this.service.Login(this.model).subscribe((data) => {
      console.log(data);
      console.log(data.userName);

    this.cookie.set("Auth-Token",data.token);//set the token to cookie
    this.cookie.set("loggedInUser",data.userName);//set the token to cookie
    this.cookie.set("loggedInUserId",data.loginresponse);//set the logedIn userId to cookie
      if (data) {
        this.isLogin = true;
        setTimeout(() => {
          this.isLogin = false;
          this.router.navigate(['/dashboard']);
        }, 3000);
      } else {
        this.isLoginFail = true;
        setTimeout(() => {
          this.isLoginFail = false;
          this.router.navigate(['/']);
        }, 3000);
      }
    }
    );

  }
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../_services/authentification.service";
import {UserService} from "../_services/user.service";
import {GiftsService} from "../_services/gifts.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl= "";
  errMsg = "";
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService, private giftService: GiftsService,
  ) {
    this.giftService.getAll().subscribe(resp=>console.log("ok"),err => this.router.navigate(["/error"]));
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/gifts']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required,  Validators.maxLength(64)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = "/gifts";
  }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.errMsg="";
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.errMsg="Invalid form, username is required, password is required";
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl],{ queryParams: { id: 0 }});
        },
        error => {
          this.errMsg = "Could not login because of  wrong credentials";
          this.loading = false;
        });
  }

  onRegister() {
    // this.router.navigate(['/register']);
    this.errMsg="";
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.errMsg="Invalid form, username size 1-64 character, password 1-64 character";
      return;
    }

    this.loading = true;
    this.userService.register(this.loginForm.value)
      .subscribe(resp => {
          this.errMsg = "";
          this.onSubmit();
        },

        err => {
          this.errMsg = "User with this username already exists, please choose another username";
          this.loading=false
        });


  }

  onGifts() {
    this.router.navigate(['/gifts']);
  }
}

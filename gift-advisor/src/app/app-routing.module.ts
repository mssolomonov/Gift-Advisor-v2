import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {GiftComponent} from "./gifts/gift.component";
import {GiftsComponent} from "./gifts/gifts.component";


const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'gift', component: GiftComponent },
  { path: 'gifts', component: GiftsComponent },
  { path: '', redirectTo: '/gifts', pathMatch: 'full' },
  // { path: '**', redirectTo: 'gifts' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

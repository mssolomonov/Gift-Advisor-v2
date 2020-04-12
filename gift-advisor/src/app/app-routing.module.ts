import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {GiftComponent} from "./gifts/gift.component";
import {GiftsComponent} from "./gifts/gifts.component";
import {ErrorComponent} from "./error/error.component";


const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'gift', component: GiftComponent },
  { path: 'gifts', component: GiftsComponent },
  { path: 'error', component: ErrorComponent },
  { path: '', redirectTo: '/gifts', pathMatch: 'full' },
  // { path: '**', redirectTo: 'gifts' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

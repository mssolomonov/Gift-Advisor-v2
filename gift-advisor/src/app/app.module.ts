import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { GiftComponent } from './gifts/gift.component';
import {CustomMaterialModule} from "./core/material.module";
import { Ng5SliderModule } from 'ng5-slider';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  MatAutocompleteModule, MatButtonModule,
  MatChipsModule,
  MatFormFieldModule,
  MatGridListModule, MatIconModule,
  MatInputModule, MatListModule, MatPaginatorIntl, MatPaginatorModule
} from "@angular/material";
import {SuccessDialog} from "./dialogs/success.dialog";
import { GiftsComponent } from './gifts/gifts.component';
import {CustomPaginator} from "./_helper/matpaginator";
import { ErrorComponent } from './error/error.component';
import { ErrorInterceptor } from './_helper/intercept';
import {NgModule} from "@angular/core";

@NgModule({
  exports: [MatIconModule, MatButtonModule], // and the exports
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GiftComponent,
    SuccessDialog,
    GiftsComponent,
    ErrorComponent,
  ],
  imports: [
    Ng5SliderModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatPaginatorModule,
    MatListModule,
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MatPaginatorIntl,
      useClass: CustomPaginator}
   ],
  entryComponents: [SuccessDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }

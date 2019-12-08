import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ErrorInterceptor} from "./_helper/error";
import { GiftComponent } from './gifts/gift.component';
import {CustomMaterialModule} from "./core/material.module";
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

@NgModule({
  exports: [MatIconModule, MatButtonModule], // and the exports
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GiftComponent,
    SuccessDialog,
    GiftsComponent,
  ],
  imports: [
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

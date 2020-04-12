import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {SuccessDialog} from "./success.dialog";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import {GiftsService} from "../_services/gifts.service";
import {of, throwError} from "rxjs";
import {Router} from "@angular/router";

describe('Success Dialog', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatButtonModule,
        MatDialogModule,
        HttpClientModule,
      ],
      declarations: [
        SuccessDialog,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: 1,
        }
      ]
    }).compileComponents();
  }));

  it('should create the dialog', () => {
    const fixture = TestBed.createComponent(SuccessDialog);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  it('should onClick dialog', () => {
    const fixture = TestBed.createComponent(SuccessDialog);
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    let router = fixture.debugElement.injector.get(Router);
    let spy = spyOn(giftsService, 'delete').and.returnValue(of('success'));
    let spy1 = spyOn(router, 'navigate');
    fixture.componentInstance.onClick();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith(['/gifts']);
  });
  it('should onClick error', () => {
    const fixture = TestBed.createComponent(SuccessDialog);
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    let router = fixture.debugElement.injector.get(Router);
    let spy = spyOn(giftsService, 'delete').and.returnValue((throwError('500')));
    let spy1 = spyOn(router, 'navigate');
    fixture.componentInstance.onClick();
    expect(spy).toHaveBeenCalled();
    expect(spy1).not.toHaveBeenCalledWith(['/gifts']);
  });

});

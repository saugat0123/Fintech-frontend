import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DhitoLikhatPrintComponent } from './dhito-likhat-print.component';

describe('DhitoLikhatPrintComponent', () => {
  let component: DhitoLikhatPrintComponent;
  let fixture: ComponentFixture<DhitoLikhatPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DhitoLikhatPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DhitoLikhatPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

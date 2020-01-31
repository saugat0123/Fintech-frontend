import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DhitoLikhatPrintComponent } from './dhito-likhat-print.component';

describe('DhitoLikhatPrintComponent', () => {
  let component: DhitoLikhatPrintComponent;
  let fixture: ComponentFixture<DhitoLikhatPrintComponent>;

  beforeEach(async(() => {
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

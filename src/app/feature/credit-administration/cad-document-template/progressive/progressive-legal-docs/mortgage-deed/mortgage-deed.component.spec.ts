import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MortgageDeedComponent} from './mortgage-deed.component';

describe('MortgageDeedComponent', () => {
  let component: MortgageDeedComponent;
  let fixture: ComponentFixture<MortgageDeedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MortgageDeedComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageDeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

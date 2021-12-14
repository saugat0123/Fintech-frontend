import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {GuaranteeBondCorporateComponent} from './guarantee-bond-corporate.component';

describe('GuaranteeBondCorporateComponent', () => {
  let component: GuaranteeBondCorporateComponent;
  let fixture: ComponentFixture<GuaranteeBondCorporateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GuaranteeBondCorporateComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeBondCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

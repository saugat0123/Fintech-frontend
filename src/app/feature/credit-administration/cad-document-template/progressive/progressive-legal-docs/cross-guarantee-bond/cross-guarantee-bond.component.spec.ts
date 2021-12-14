import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CrossGuaranteeBondComponent} from './cross-guarantee-bond.component';

describe('CrossGuaranteeBondComponent', () => {
  let component: CrossGuaranteeBondComponent;
  let fixture: ComponentFixture<CrossGuaranteeBondComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CrossGuaranteeBondComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossGuaranteeBondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

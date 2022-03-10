import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveBankSolComponent } from './above-bank-sol.component';

describe('AboveBankSolComponent', () => {
  let component: AboveBankSolComponent;
  let fixture: ComponentFixture<AboveBankSolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveBankSolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveBankSolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

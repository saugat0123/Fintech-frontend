import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailPrimarySecurityComponent } from './retail-primary-security.component';

describe('RetailPrimarySecurityComponent', () => {
  let component: RetailPrimarySecurityComponent;
  let fixture: ComponentFixture<RetailPrimarySecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailPrimarySecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailPrimarySecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

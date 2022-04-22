import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailSecondarySecurityComponent } from './retail-secondary-security.component';

describe('RetailSecondarySecurityComponent', () => {
  let component: RetailSecondarySecurityComponent;
  let fixture: ComponentFixture<RetailSecondarySecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailSecondarySecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailSecondarySecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

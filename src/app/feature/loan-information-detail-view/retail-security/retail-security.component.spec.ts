import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailSecurityComponent } from './retail-security.component';

describe('RetailSecurityComponent', () => {
  let component: RetailSecurityComponent;
  let fixture: ComponentFixture<RetailSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

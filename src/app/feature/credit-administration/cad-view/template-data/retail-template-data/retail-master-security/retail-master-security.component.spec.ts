import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailMasterSecurityComponent } from './retail-master-security.component';

describe('RetailMasterSecurityComponent', () => {
  let component: RetailMasterSecurityComponent;
  let fixture: ComponentFixture<RetailMasterSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailMasterSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailMasterSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

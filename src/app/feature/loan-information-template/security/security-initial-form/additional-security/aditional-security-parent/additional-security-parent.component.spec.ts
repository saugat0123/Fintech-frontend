import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalSecurityParentComponent } from './additional-security-parent.component';

describe('AdiitionalSecurityParentComponent', () => {
  let component: AdditionalSecurityParentComponent;
  let fixture: ComponentFixture<AdditionalSecurityParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalSecurityParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalSecurityParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

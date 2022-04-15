import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityMasterTemplateComponent } from './security-master-template.component';

describe('SecurityMasterTemplateComponent', () => {
  let component: SecurityMasterTemplateComponent;
  let fixture: ComponentFixture<SecurityMasterTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityMasterTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityMasterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

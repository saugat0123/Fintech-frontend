import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section2SmeSecurityComponent } from './section2-sme-security.component';

describe('Section2SmeSecurityComponent', () => {
  let component: Section2SmeSecurityComponent;
  let fixture: ComponentFixture<Section2SmeSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section2SmeSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section2SmeSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

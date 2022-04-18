import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeMasterTemplateComponent } from './sme-master-template.component';

describe('SmeMasterTemplateComponent', () => {
  let component: SmeMasterTemplateComponent;
  let fixture: ComponentFixture<SmeMasterTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeMasterTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeMasterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

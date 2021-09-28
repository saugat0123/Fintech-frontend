import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeTemplateDataComponent } from './sme-template-data.component';

describe('SmeTemplateDataComponent', () => {
  let component: SmeTemplateDataComponent;
  let fixture: ComponentFixture<SmeTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

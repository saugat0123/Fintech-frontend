import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateAddModelComponent } from './template-add-model.component';

describe('TemplateAddModelComponent', () => {
  let component: TemplateAddModelComponent;
  let fixture: ComponentFixture<TemplateAddModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateAddModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateAddModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

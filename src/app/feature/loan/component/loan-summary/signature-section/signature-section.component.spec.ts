import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureSectionComponent } from './signature-section.component';

describe('SignatureSectionComponent', () => {
  let component: SignatureSectionComponent;
  let fixture: ComponentFixture<SignatureSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

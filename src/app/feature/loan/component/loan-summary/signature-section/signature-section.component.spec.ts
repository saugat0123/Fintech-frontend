import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SignatureSectionComponent } from './signature-section.component';

describe('SignatureSectionComponent', () => {
  let component: SignatureSectionComponent;
  let fixture: ComponentFixture<SignatureSectionComponent>;

  beforeEach(waitForAsync(() => {
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

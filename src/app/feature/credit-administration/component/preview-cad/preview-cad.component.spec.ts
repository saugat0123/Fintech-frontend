import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCadComponent } from './preview-cad.component';

describe('PreviewCadComponent', () => {
  let component: PreviewCadComponent;
  let fixture: ComponentFixture<PreviewCadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewCadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

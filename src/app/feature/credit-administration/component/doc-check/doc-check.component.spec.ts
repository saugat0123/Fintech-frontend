import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocCheckComponent } from './doc-check.component';

describe('DocCheckComponent', () => {
  let component: DocCheckComponent;
  let fixture: ComponentFixture<DocCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

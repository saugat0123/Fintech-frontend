import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareValueFormComponent } from './share-value-form.component';

describe('ShareValueFormComponent', () => {
  let component: ShareValueFormComponent;
  let fixture: ComponentFixture<ShareValueFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareValueFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareValueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeGlobalContentComponent } from './sme-global-content.component';

describe('SmeGlobalContentComponent', () => {
  let component: SmeGlobalContentComponent;
  let fixture: ComponentFixture<SmeGlobalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeGlobalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeGlobalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

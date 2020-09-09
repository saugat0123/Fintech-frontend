import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSecurityDetailsComponent } from './share-security-details.component';

describe('ShareSecurityDetailsComponent', () => {
  let component: ShareSecurityDetailsComponent;
  let fixture: ComponentFixture<ShareSecurityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareSecurityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareSecurityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

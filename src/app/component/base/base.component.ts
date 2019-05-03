import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  title: string;

  constructor(private dataService: CommonDataService) { }

  ngOnInit(): void {
    this.dataService.currentTitle.subscribe(message => this.title = message)
  }


  ngOnDestroy(): void {
    document.body.className = '';
  }

  ngAfterViewInit(): void {
    document.body.className = 'skin-blue sidebar-mini';
    const headerHeight = document.getElementsByClassName('main-header').item(0).clientHeight;
    const footerHeight = document.getElementsByClassName('main-footer').item(0).clientHeight;
    (<HTMLElement>document.getElementsByClassName('content-wrapper')
      .item(0)).style.minHeight = window.innerHeight - headerHeight - footerHeight + 'px';
  }

}

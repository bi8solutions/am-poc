import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MdCardModule, MdPaginatorModule, MdTableModule, MdToolbarModule} from "@angular/material";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CdkTableModule} from "@angular/cdk/table";
import {PocModule} from "@bi8/am-poc";
import {AppComponent} from "./app.component";

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    MdCardModule,
    MdToolbarModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    PocModule,
    MdTableModule,
    CdkTableModule,
    FlexLayoutModule,
    MdPaginatorModule
  ],
  entryComponents: [],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers:    []
})
export class AppModule { }

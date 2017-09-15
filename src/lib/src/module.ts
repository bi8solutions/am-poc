import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";

import { UnlessDirective } from './poc/unless.directive';

import {
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdDatepickerModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdOptionModule,
  MdSelectModule,
  MdSidenavModule,
  MdToolbarModule
} from "@angular/material";

import {
  MessageComponent,
  MessageDirective,
  ComponentPlaceholderDirective,
  TemplatePlaceholderDirective,
  TemplateExampleComponent
} from "./poc/template-examples";

import {
  GridComponent,
  HeaderRowOutlet,
  DataRowOutlet,
  RowOutlet,
  ExpanderOutlet,
  HeaderRowDef,
  HeaderRow,
  HeaderCellDef,
  HeaderCell,
  DataRow,
  CellOutlet,
  DataCell,
  DataRowDef,
  DataCellDef,


  GridDateFormatter,
  GridPropertyFormatter,
  GridDataFormatter,
  GridKeyHeaderFormatter,
  GridHeaderFormatter,
  GridExpanderFormatter,
} from "./poc/grid";

import {
  GridService
} from "./poc/grid.service"

import {
  NestedPlaceholder,
  NestedChildPlaceholder,
  NestedParentDef,
  NestedChildDef,
  NestedComponent
} from './poc/nested'


@NgModule({
    exports: [
      UnlessDirective,

      TemplateExampleComponent,

      ComponentPlaceholderDirective,
      TemplatePlaceholderDirective,

      MessageDirective,
      MessageComponent,


      GridComponent,
      HeaderRowDef,
      HeaderRow,
      HeaderCellDef,
      HeaderCell,
      HeaderRowOutlet,
      DataRowOutlet,
      RowOutlet,
      ExpanderOutlet,
      DataRowDef,
      DataRow,
      DataCellDef,
      DataCell,
      CellOutlet,
      GridKeyHeaderFormatter,
      GridPropertyFormatter,
      GridDateFormatter,

      NestedPlaceholder,
      NestedChildPlaceholder,
      NestedParentDef,
      NestedChildDef,
      NestedComponent,


      GridKeyHeaderFormatter,
      GridPropertyFormatter,
      GridDateFormatter,
    ],
    declarations: [
      UnlessDirective,

      TemplateExampleComponent,

      ComponentPlaceholderDirective,
      TemplatePlaceholderDirective,

      MessageDirective,
      MessageComponent,

      GridComponent,
      HeaderRowDef,
      HeaderRow,
      HeaderCellDef,
      HeaderCell,

      DataRowDef,
      DataRow,
      DataCellDef,
      DataCell,

      HeaderRowOutlet,
      DataRowOutlet,
      RowOutlet,
      ExpanderOutlet,
      CellOutlet,

      NestedPlaceholder,
      NestedChildPlaceholder,
      NestedParentDef,
      NestedChildDef,
      NestedComponent,

      GridKeyHeaderFormatter,
      GridPropertyFormatter,
      GridDateFormatter,
    ],
    imports: [
      CommonModule,
      RouterModule,
      BrowserAnimationsModule,
      FlexLayoutModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      MdCardModule,
      MdButtonModule,
      MdCheckboxModule,
      MdDatepickerModule,
      MdInputModule,
      MdSelectModule,
      MdOptionModule,
      MdDialogModule,
      MdToolbarModule,
      MdIconModule,
      MdSidenavModule,
      MdMenuModule,
      MdListModule
    ],
    entryComponents: [
      GridKeyHeaderFormatter,
      GridPropertyFormatter,
      GridDateFormatter
    ],
    providers: [GridService]
})
export class PocModule {
}

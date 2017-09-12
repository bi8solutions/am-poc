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

  HeaderRowDef,
  HeaderRow,
  HeaderCellDef,
  HeaderCell,

  DataRow,
  CellOutlet,
  DataCell, PropertyFormatter, DatePropertyFormatter, HeadingFormatter
} from "./poc/grid";

import {
  NestedPlaceholder,
  NestedChildPlaceholder,
  NestedParentDef,
  NestedChildDef,
  NestedComponent
} from './poc/nested'
import {GridService} from "./poc/grid.service";

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

      DataRow,
      CellOutlet,
      DataCell,

      NestedPlaceholder,
      NestedChildPlaceholder,
      NestedParentDef,
      NestedChildDef,
      NestedComponent,

      PropertyFormatter, DatePropertyFormatter, HeadingFormatter
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

      HeaderRowOutlet,
      DataRowOutlet,
      RowOutlet,
      DataRow,
      CellOutlet,
      DataCell,

      NestedPlaceholder,
      NestedChildPlaceholder,
      NestedParentDef,
      NestedChildDef,
      NestedComponent,

      PropertyFormatter, DatePropertyFormatter, HeadingFormatter
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
    entryComponents: [PropertyFormatter, DatePropertyFormatter, HeadingFormatter],
    providers: [GridService]
})
export class PocModule {
}

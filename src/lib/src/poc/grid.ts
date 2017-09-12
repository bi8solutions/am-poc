import {
  AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ContentChild,
  Directive, ElementRef, Input, IterableChangeRecord, IterableChanges, IterableDiffer,
  IterableDiffers,
  OnChanges, OnDestroy,
  OnInit, QueryList, Renderer2, SimpleChanges,
  TemplateRef, Type,
  ViewChild, ViewChildren,
  ViewContainerRef, ViewEncapsulation
} from "@angular/core";
import {Subject} from "rxjs/Subject";

import * as _ from 'lodash';
import {GridService} from "./grid.service";
import {Subscription} from "rxjs/Subscription";
import {DataSource} from "@angular/cdk/collections";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {MdPaginator} from "@angular/material";
import {Observable} from "rxjs/Observable";

function toCssFriendly(value: string) : string {
  // the string value is typically generated from the column key that may contain '.'
  return value ? value.split('.').map(item => _.kebabCase(item)).join('-') : value;
}

@Directive({selector: '[headerRowOutlet]'})
export class HeaderRowOutlet  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Directive({selector: '[dataRowOutlet]'})
export class DataRowOutlet  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Directive({selector: '[rowOutlet]'})
export class RowOutlet  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Directive({selector: '[cellOutlet]'})
export class CellOutlet  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Directive({
  selector: '[headerRowDef]',
  inputs: ['model: headerRowDef']
})
export class HeaderRowDef {
  model: GridModel;

  constructor(public templateRef: TemplateRef<any>, public viewContainer: ViewContainerRef){
  }
}

@Directive({
  selector: '[headerCellDef]',
  inputs: ['column: column']
})
export class HeaderCellDef {

  column: GridColumn;

  //@Input() set $implicit(column: GridColumn) {
  //  this.column = column;
  //}

  constructor(public templateRef: TemplateRef<any>,
              public viewContainer: ViewContainerRef){
  }

  ngAfterContentInit(): void {
    console.log("==============> " + this.column);
  }
}

@Component({
  selector: 'header-cell',
  inputs: ['column: column'],
  template: `
    <ng-container cellOutlet></ng-container>
  `,
  host: {
    'class': 'am-header-cell',
    'role': 'row',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderCell implements OnInit, OnDestroy, AfterContentInit,  OnChanges {

  column: GridColumn;
  @ViewChild(CellOutlet) _cellOutlet: CellOutlet;

  constructor(protected componentFactoryResolver: ComponentFactoryResolver,
              protected elementRef: ElementRef,
              protected renderer: Renderer2){
  }

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, `am-header-cell-${toCssFriendly(this.column.config.key)}`);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterContentInit(): void {
    this.renderCell();
  }

  renderCell(){
    this._cellOutlet.viewContainer.clear();
    
    if (this.column.config.headingTemplate){
      this._cellOutlet.viewContainer.createEmbeddedView(this.column.config.headingTemplate, {column: this.column});

    } else {
      let formatter: Type<HeaderFormatter> = this.column.config.headingFormatter;
      if (formatter){
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(formatter);

        let viewContainerRef = this._cellOutlet.viewContainer;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<HeaderFormatter>componentRef.instance).column = this.column;

      } else {
        console.warn(`Could not find header formatter for column with key '${this.column.config.key}'.`);
      }
    }
  }
}

@Component({
  selector: 'header-row',
  inputs: ['model: model'],
  template: `
    <ng-container rowOutlet></ng-container>
    <ng-container>
      <header-cell *headerCellDef="let column;" [column]="column"></header-cell>
      
      <!--<header-cell *headerCellDef="let column as column;" [column]="column"></header-cell>-->
    </ng-container>
  `,
  host: {
    'class': 'am-header-row',
    'role': 'row',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderRow implements AfterContentInit {

  @ViewChild(RowOutlet) _rowOutlet: RowOutlet;
  @ViewChild(HeaderCellDef) _headerCellDef: HeaderCellDef;
  @ViewChildren(HeaderCell) headerCells : QueryList<HeaderCell>;

  model: GridModel;

  constructor(protected _changeDetectorRef: ChangeDetectorRef){
  }

  ngAfterContentInit(): void {
    // first we clear the row container
    this._rowOutlet.viewContainer.clear();

    // then render each column
    this.model.columns.forEach((column, index)=>{
      this.renderHeaderCell(column);
    });
  }

  renderHeaderCell(column: GridColumn, index?: number){
    this._rowOutlet.viewContainer.createEmbeddedView(this._headerCellDef.templateRef, {$implicit: column}, index);
  }

  /**
   * Iterate the changes and apply add/remove/insert operations to the collection of header cells (columns)
   * @todo - can still do the TODO one for moving a column (look at material2 data table sort for an example
   *
   * @param {IterableChanges<GridColumn>} changes
   */
  applyColumnChanges(changes: IterableChanges<GridColumn>){
    if (!changes){
      return;
    }

    // add, insert
    changes.forEachAddedItem((record: IterableChangeRecord<GridColumn>)=>{
       console.log("adding/inserting new cell for new column", record);
       this.renderHeaderCell(record.item, record.currentIndex);
    });

    // remove
    changes.forEachRemovedItem((record: IterableChangeRecord<GridColumn>)=>{
      console.log("removing existing cell", record);
      this._rowOutlet.viewContainer.remove(record.previousIndex);
    });

    // then tell Angular to do it's checks
    this._changeDetectorRef.markForCheck();
  }
}

@Directive({selector: '[dataRow]'})
export class DataRow  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Directive({selector: '[dataCell]'})
export class DataCell  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Component({
  selector: 'grid',
  styleUrls: ['./grid.scss'],
  template: `
    
    <div class="am-grid">
      <ng-container headerRowOutlet></ng-container>
      <ng-container dataRowOutlet></ng-container>
      
      <ng-container>
        <header-row *headerRowDef="let model" [model]="model"></header-row>
        <!--<data-row *dataRowDef="let row" [model]="row"></data-row>-->
        
        <!--
        <div *dataRowDef="let row of rows">
          <ng-container cellOutlet></ng-container>
          <ng-container expanderOutlet></ng-container>
          
          <ng-template #cellTemplate let-row>
            <div class="am-data-cell">
              <ng-container formatterOutlet></ng-container>
            </div>
          </ng-template>
        </div>
        
        <ng-template dataRowDef let-row dataRowDefOf="rows">
          <div class="am-data-row">
            <ng-container cellOutlet></ng-container>
            
            <ng-template #cellTemplate let-row>
              <div class="am-data-cell">
                <ng-container formatterOutlet></ng-container>
              </div>
            </ng-template>
            
            
            
            
            
            <ng-container cellOutlet></ng-container>
            <ng-container expanderOutlet></ng-container>  
          </div>
          
        </ng-template>-->
        
        <!--
          If there is an expander, we need to show a chevron - it could be that the chevron can be displayed at differtn places
          I would also like an select on the left hand side or the end (configurable)        
        -->
        
        <!-- lets do a test here -->
        
        <!--
        <data-row *dataRowDef="let row; model;"></data-row>
        -->
        
        <!--
        <data-row class="am-data-row" *dataRowDef>
          <ng-container rowOutlet></ng-container>
        </data-row>
        
        <div class="am-data-row" *dataRowDef>
          <ng-container rowOutlet></ng-container>
        </div>
        
        <div class="am-header-cell" *headerCellDef>
          <ng-container cellOutlet></ng-container>
        </div>
        
        <div class="am-data-cell" *dataCellDef>
          <ng-container cellOutlet></ng-container>
        </div>
        -->
      </ng-container>  
    </div>
    
    <!--
    <div class="am-grid">
      <div class="am-header-row">
        <div class="am-header-cell">header1</div>
        <div class="am-header-cell">header2</div>
        <div class="am-header-cell">header3</div>
      </div>
      <div class="am-data-row">
        <div class="am-data-cell">data1</div>
        <div class="am-data-cell">data2</div>
        <div class="am-data-cell">data3</div>
      </div>
      <div class="am-data-row">
        <div class="am-data-cell">data1</div>
        <div class="am-data-cell">data2</div>
        <div class="am-data-cell">data3</div>
      </div>
    </div>
    -->
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, AfterViewInit, OnDestroy, AfterContentInit, AfterContentChecked, OnChanges {

  @Input() model: GridModel;

  @ViewChild(HeaderRowOutlet) _headerRowOutlet: HeaderRowOutlet;
  @ViewChild(HeaderRowDef) _headerRowDef: HeaderRowDef;

  @ViewChild('headerRow') headerRowTemplate: TemplateRef<any>;
  @ViewChild(HeaderRow) headerRow : HeaderRow;   // wil only be visible on the next changes (after everything has rendered)

  // keep track of the changes on the model's columns
  private _columnsDiffer: IterableDiffer<GridColumn>;

  modelSubscription: Subscription;

  constructor(private gridService: GridService,
              protected _differs: IterableDiffers,
              protected _changeDetectorRef: ChangeDetectorRef){
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // clean up the subscription to the grid model when we are destroyed
    if (this.modelSubscription){
      this.modelSubscription.unsubscribe();
      this.modelSubscription = null;
    }
  }

  ngAfterContentInit(): void {
    // make sure that all the column override/default templates/formatters are applied
    this.gridService.applyDefaults(this.model.columns);

    // create the columns differ to track changes to the column array
    this._columnsDiffer = this._differs.find(this.model.columns).create();

    // do the initial diff so that the next one will show any changes when doing the next diff
    this._columnsDiffer.diff(this.model.columns);

    // ok, lets setup/render the header row
    this.setupHeader();

    // we subscribe to the model so that we can update the header row when there are any column changes
    this.modelSubscription = this.model._changes.subscribe((columns: GridColumn[])=>{
      this.gridModelChanged();
    });
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewInit(): void {
  }

  setupHeader(){
    // lets clear the row outlet container to make sure everyhting is squaky clean
    this._headerRowOutlet.viewContainer.clear();

    // render the template that contains the header row component
    this._headerRowOutlet.viewContainer.createEmbeddedView(this._headerRowDef.templateRef, {$implicit: this.model});
  }

  gridModelChanged(){
    // first we do the diff to get the changes (if any)
    const changes = this._columnsDiffer.diff(this.model.columns);

    // tell header row to look at the changes to insert/update/remove where required
    this.headerRow.applyColumnChanges(changes);

    /*changes.forEachOperation(
    (item: IterableChangeRecord<any>, adjustedPreviousIndex: number, currentIndex: number) => {
      console.log("column changes: ", item);
      if (item.previousIndex == null) {
        //this._insertRow(this._data[currentIndex], currentIndex);
      } else if (currentIndex == null) {
        //viewContainer.remove(adjustedPreviousIndex);
      } else {
        //const view = viewContainer.get(adjustedPreviousIndex);
        //viewContainer.move(view!, currentIndex);
      }
     });*/

    // this.headerRow.modelChanged();

    /*this.headerRows.forEach((headerRow, index)=>{
      //console.log("rendering header row: ", index);
      headerRow.modelChanged();
    });*/

    // make sure that our component is checked for any other changes
    this._changeDetectorRef.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("GirdComponent: ngOnChanges");
  }
}

export interface GridModelConfig {
  selection?: boolean
}

export interface GridModelStyles {
  containerClasses?: string[],
  gridClasses?: string[],
  scrollX?: boolean,
  minWidth?: string,
  maxWidth?: string
}

export class GridModel {
  config: GridModelConfig;
  styles: GridModelStyles;
  columns: GridColumn[] = [];
  _changes = new Subject<GridColumn[]>();

  constructor(config: GridModelConfig = {}, styles: GridModelStyles = {}){
    this.config = {
      selection: !_.isNil(config.selection) ? config.selection : false
    };

    this.styles = {
      containerClasses: !_.isNil(styles.containerClasses) ?  styles.containerClasses : [],
      gridClasses: !_.isNil(styles.containerClasses) ? styles.containerClasses : [],
      scrollX: !_.isNil(styles.scrollX) ? styles.scrollX : false,
      minWidth: !_.isNil(styles.minWidth) ? styles.minWidth : null,
      maxWidth: !_.isNil(styles.maxWidth) ? styles.maxWidth : null,
    };
  }

  addColumn(column: GridColumn){
    this.columns.push(column);
    this._changes.next(this.columns);
  }

  /*changes() : Subject<GridColumn[]> {
    return this._changes.debounceTime(10) as Subject<GridColumn[]>;
  }*/

  /*getColumnByKey(key: string){
    return _.find(this.columns, { config: {key: key}});
  }*/

  insertColumn(column: GridColumn, index: number){
    this.columns.splice(index, 0, column);
    this.notifyChanges();
  }

  removeColumn(column: GridColumn){
    this.columns = _.without(this.columns, column);
    this.notifyChanges();
  }

  removeColumnByIndex(index: number){
    this.columns.splice(index, 1);
    this.notifyChanges();
  }

  removeColumnsByKey(key: string){
    _.remove(this.columns, (column)=>{
      return column.config.key == key;
    });
    this.notifyChanges();
  }

  removeAll(){
    this.columns = [];
    this.notifyChanges();
  }

  notifyChanges(){
    this._changes.next(this.columns);
  }
}

export interface GridColumnConfig {
  key: string,
  type?: string;
  heading?: string,
  sortable?: boolean,
  noHeading?: boolean,    // if we should display an heading

  headingFormatter?: Type<HeaderFormatter>;
  formatter?: Type<RowDataFormatter>;

  context?: any;
  headingTemplate?: TemplateRef<any>;
  dataTemplate?: TemplateRef<any>;

  options? : any;
}

export interface GridColumnStyle {
  headerCellStyleClasses?: string[];
  filterCellStyleClasses?: string[];
  dataCellStyleClasses?: string[];
  flex?: number;
  minWidth?: string;
  maxWidth?: string;
}

export class GridColumn {
  config: GridColumnConfig;
  styles: GridColumnStyle;
  options: any;

  constructor(config: GridColumnConfig, styles: GridColumnStyle = {}, options: any = {}){
    this.config = {
      key: config.key,
      type: config.type || 'text',
      heading: config.heading,
      sortable: !_.isNil(config.sortable) ? config.sortable : false,
      noHeading: config.noHeading,
      headingFormatter: config.headingFormatter || HeadingFormatter,
      formatter: config.formatter,
      context: config.context || {},
      headingTemplate: config.headingTemplate,
      dataTemplate: config.dataTemplate
    };

    this.styles = {
      headerCellStyleClasses: !_.isNil(styles.headerCellStyleClasses) ? styles.headerCellStyleClasses : [],
      filterCellStyleClasses: !_.isNil(styles.filterCellStyleClasses) ? styles.filterCellStyleClasses : [],
      dataCellStyleClasses: !_.isNil(styles.dataCellStyleClasses) ? styles.dataCellStyleClasses : [],
      flex: !_.isNil(styles.flex) ? styles.flex : 1,
      minWidth: !_.isNil(styles.minWidth) ? styles.minWidth : null,
      maxWidth: !_.isNil(styles.maxWidth) ? styles.maxWidth : null
    };

    if (!this.config.heading && !this.config.noHeading){
      let tempHeading = this.config.key;
      this.config.heading = '';

      tempHeading.split('.').forEach((name, index)=>{
        this.config.heading += _.startCase(name) + ' ';
      });
    }

    this.options = options;
  }

  show(){
  }

  hide(){
  }
}


export class DataGridFormatter {
  constructor(public component: Type<RowDataFormatter>, public row: any){
  }
}

export interface RowDataFormatter {
  column: GridColumn;
  row: any;
}

@Component({
  template: `{{getValue()}}`
})
export class PropertyFormatter implements RowDataFormatter {
  @Input() column: GridColumn;
  @Input() row: any;

  getValue(){
    try {
      return eval(`this.row.${this.column.config.key}`);
    } catch (error){
      return null;
    }
  }
}

@Component({
  template: `{{getValue() | date : getFormat()}}`
})
export class DatePropertyFormatter extends PropertyFormatter {
  @Input() column: GridColumn;
  @Input() row: any;

  getFormat(){
    return this.column.options.dateFormat || 'fullDate';
  }
}

export interface HeaderFormatter {
  column: GridColumn;
}

@Component({
  template: `{{column.config.heading}}`
})
export class HeadingFormatter implements HeaderFormatter {
  @Input() column: GridColumn;
}

export class ArrayDS extends DataSource<any[]> {

  itemSource$ = new BehaviorSubject<any[]>([]);
  items: any[] = [];

  pageSize: number = 5;
  pageIndex: number = 0;
  totalSize: number = 0;

  constructor(private paginator: MdPaginator) {
    super ();

    if (this.paginator) {
      this.paginator.page.subscribe((event) => {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.reload();
      });
    }
  }

  connect(): Observable<any[]> {
    return this.itemSource$.asObservable();
  }

  disconnect(): void {
  }

  reload(){
    if (!this.paginator) {
      this.totalSize = this.items.length;
      this.itemSource$.next(this.items);
    } else {

    }
  }

  addItem(item: any){
    this.items.push(item);
  }

  removeItem(item: any){
    this.items = _.without(this.items, item);
  }

  removeAll(){
    this.items = [];
  }
}

import {
  AfterContentChecked, AfterContentInit, AfterViewInit, Component, ContentChild, Directive, forwardRef, OnChanges, OnDestroy, OnInit, SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from "@angular/core";

@Directive({selector: '[nestedPlaceholder]'})
export class NestedPlaceholder  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Directive({selector: '[nestedChildPlaceholder]'})
export class NestedChildPlaceholder  {
  constructor(public viewContainer: ViewContainerRef){}
}

@Directive({ selector: '[parentDef]'})
export class NestedParentDef  {
  constructor(public templateRef: TemplateRef<any>, public viewContainer: ViewContainerRef){
  }
}

@Directive({ selector: '[childDef]'})
export class NestedChildDef {
  constructor(public templateRef: TemplateRef<any>, public viewContainer: ViewContainerRef){
  }
}

@Component({
  selector: 'nested',
  template: `
    <div>
      <ng-container nestedPlaceholder></ng-container>
      <ng-container>
        <div class="am-header-row" *parentDef>
          <ng-container nestedChildPlaceholder></ng-container>
          <div class="am-header-cell" *childDef></div>
        </div>
      </ng-container>  
    </div>
  `
})
export class NestedComponent implements OnInit, AfterViewInit, OnDestroy, AfterContentInit, AfterContentChecked, OnChanges {

  @ViewChild(NestedPlaceholder) nestedPlaceholder : NestedPlaceholder;
  //@ViewChild(forwardRef(() => NestedChildPlaceholder) nestedChildPlaceholder: NestedChildPlaceholder;
  @ContentChild(forwardRef(() => NestedChildPlaceholder)) nestedChildPlaceholder : NestedChildPlaceholder;

  @ViewChild(NestedParentDef) nestedParentDef : NestedParentDef;

  constructor(){
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("==== CHANGES ====", this.nestedChildPlaceholder);
  }

  ngOnInit(): void {
    console.log("NestedComponent: ", this.nestedPlaceholder);
        console.log("NestedParentDef: ", this.nestedParentDef);

        this.nestedPlaceholder.viewContainer.createEmbeddedView(this.nestedParentDef.templateRef);
  }

  ngOnDestroy(): void {
  }

  ngAfterContentInit(): void {
    console.log("NestedChildPlaceholder: ", this.nestedChildPlaceholder);
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewInit(): void {
  }
}



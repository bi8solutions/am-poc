import {Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {GridColumn, GridModel} from "@bi8/am-poc";

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html' ,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  gridModel: GridModel;
  @ViewChild("firstNameHeaderTemplate") private firstNameHeaderTemplate: TemplateRef<any>;

  constructor() {
  }

  ngOnInit(): void {
    this.gridModel = new GridModel();
    this.gridModel.addColumn(new GridColumn({key: 'firstName', headingTemplate: this.firstNameHeaderTemplate}));
    this.gridModel.addColumn(new GridColumn({key: 'lastName'}));
    this.gridModel.addColumn(new GridColumn({key: 'nickName'}));
    this.gridModel.addColumn(new GridColumn({key: 'email'}));
    this.gridModel.addColumn(new GridColumn({key: 'mobile'}));
    this.gridModel.addColumn(new GridColumn({key: 'landLine'}));
  }

  addColumn(){
    this.gridModel.addColumn(new GridColumn({key: 'anotherFirstNameColumn', headingTemplate: this.firstNameHeaderTemplate}));
    //this.gridModel.addColumn(new GridColumn({key: 'anotherFirstNameColumn'}));
  }

  insertColumn(index: number){
    this.gridModel.insertColumn(new GridColumn({key: `insertedColumn${index}`}), index);
  }

  removeColumn(index: number){
    this.gridModel.removeColumnByIndex(index);
  }
}

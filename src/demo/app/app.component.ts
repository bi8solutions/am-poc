import {Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {GridColumn, GridModel, ArrayDS} from "@bi8/am-poc";

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html' ,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  gridModel: GridModel;
  data: any[] = [];

  arrayDS : ArrayDS;
  message: string = 'Hello World';

  @ViewChild("firstNameHeaderTemplate") private firstNameHeaderTemplate: TemplateRef<any>;
  @ViewChild("firstNameDataTemplate") private firstNameDataTemplate: TemplateRef<any>;
  @ViewChild("expanderTemplate") private expanderTemplate: TemplateRef<any>;

  constructor() {
    this.arrayDS = new ArrayDS();
    this.arrayDS.addItem({ firstName: "Peter", lastName: "Parker", nickName: 'Spiderman', email: "peter.parekr@marvel.com", mobile: "082444", landLine: "0215649595" });
    this.arrayDS.addItem({ firstName: "Bruce", lastName: "Wayne", nickName: 'Batman', email: "bruce.wayne@dc.com", mobile: "082444", landLine: "0215649595", insertedColumn: "Blaf" });
  }

  ngOnInit(): void {
    this.gridModel = new GridModel();
    this.gridModel.addColumn(new GridColumn({
      key: 'firstName',
      headingTemplate: this.firstNameHeaderTemplate,
      dataTemplate: this.firstNameDataTemplate
    }));
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
    this.gridModel.insertColumn(new GridColumn({key: `insertedColumn`}), index);
  }

  removeColumn(index: number){
    this.gridModel.removeColumnByIndex(index);
  }

  addRow(){
    this.arrayDS.addItem({
      firstName: "Manie",
      lastName: "Coetzee",
      nickName: 'Blaf',
      email: "mc@bla.bla.xom",
      mobile: "082444",
      landLine: "0215649595",
      anotherFirstNameColumn: "Blaf"
    })
  }

  insertRow(index: number){
    this.arrayDS.insertItem({
      firstName: "Manie",
      lastName: "Coetzee",
      nickName: 'Blaf',
      email: "mc@bla.bla.xom",
      mobile: "082444",
      landline: "021"
    }, index);
  }

  removeRow(index: number){
    this.arrayDS.removeItemByIndex(index);
  }
}

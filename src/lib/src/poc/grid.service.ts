import {GridColumn, GridDateFormatter, GridPropertyFormatter} from "./grid";
import {Injectable} from "@angular/core";
import * as _ from 'lodash';

@Injectable()
export class GridService {

  columns : Map<string, GridColumn> = new Map();

  constructor(){
    let dateCol = new GridColumn({
      type: 'date',
      key: 'date',
      formatter: GridDateFormatter
    },{

    },{
      dateFormat: 'fullDate'
    });

    let textCol = new GridColumn({type: 'text', key: 'text', formatter: GridPropertyFormatter });

    this.setDefaultColumn(dateCol.config.type, dateCol);
    this.setDefaultColumn(textCol.config.type, textCol);
  }

  setDefaultColumn(type: string, column: GridColumn){
    this.columns.set(type, column);
  }

  getDefaultColumn(type: string) : GridColumn {
    return this.columns.get(type);
  }

  applyDefaults(columns: GridColumn[]){
    if (!columns || columns.length == 0){
      return;
    }

    columns.forEach((column, index)=>{
      let defaultColumn = this.getDefaultColumn(column.config.type);
      if (defaultColumn){
        _.defaultsDeep(column, defaultColumn);
        //console.log(column);
      }
    });
  }
}
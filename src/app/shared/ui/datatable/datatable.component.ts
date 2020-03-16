import {
  Component,
  Input,
  ElementRef,
  AfterContentInit,
  OnInit,
  Output,
  EventEmitter
} from "@angular/core";

import "script-loader!smartadmin-plugins/datatables/datatables.min.js";
import { I18nService } from "@app/shared/i18n/i18n.service";
import { isNumber } from "util";
import * as _ from "lodash";

@Component({
  selector: "sa-datatable",
  template: `
      <table class="dataTable responsive {{tableClass}}" width="{{width}}">
        <ng-content></ng-content>
      </table>
`,
  styles: [require("smartadmin-plugins/datatables/datatables.min.css")]
})
export class DatatableComponent implements OnInit {
  @Input()
  public options: any;
  @Input()
  public filter: any;
  @Input()
  public detailsFormat: any;
  @Input()
  public delayRender: number;
  @Input()
  public paginationLength: boolean;
  @Input()
  public columnsHide: boolean;
  @Input()
  public tableClass: string;
  @Input()
  public width: string = "100%";
  @Output()
  rowClick = new EventEmitter<any>();
  @Output() rowDbClick = new EventEmitter<any>();
  selected_rows = [];
  
  constructor(private el: ElementRef, private langService: I18nService) { }

  ngOnInit() {
    if(this.delayRender && this.delayRender>0){
      setTimeout(() => {
        this.render();
      }, this.delayRender);
    }
    else{
      this.render();
    }
  }
  
  render() {
    //console.log(this.otherService);
    //console.log('datatable is operating render' + this.translate('AUTHORITY-GROUP-MENU-SETTING'));

    let element = $(this.el.nativeElement.children[0]);
    let options = this.options || {};

    let toolbar = "";
    // if (options.buttons)
    //   toolbar += 'B';
    if (this.paginationLength) toolbar += "l";
    if (this.columnsHide) toolbar += "C";

    if (typeof options.ajax === "string") {
      let url = options.ajax;
      options.ajax = {
        url: url
        // complete: function (xhr) {
        //
        // }
      };
    }

    let leftToolbar = "";
    if (options.buttons) leftToolbar += "B";

    options = $.extend(options, {
      dom:
        "<'dt-toolbar'<'col-xs-12 col-sm-6'" +
        leftToolbar +
        "><'col-sm-6 col-xs-12 hidden-xs child-right'" +
        toolbar +
        ">r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
      oLanguage: {
        sSearch:
          "<span class='input-group-addon'><i class='glyphicon glyphicon-search'></i></span> ",
        sLengthMenu: this.langService.getTranslation("sLengthMenu"),
        sProcessing: "<img src='/assets/img/ajax-loader.gif'>",
        // "lengthMenu": "Display _MENU_ records per page",    //Customizing menu Text
        // "zeroRecords": "Nothing found - sorry",             //Customizing zero record text - filtered
        // "info": "Showing page _PAGE_ of _PAGES_",           //Customizing showing record no
        // "infoEmpty": "No records available",                //Customizing zero record message - base
        // "infoFiltered": "(filtered from _MAX_ total records)"   //Customizing filtered message
        // Add on: 10-10-2018
        // Author by: AtmanEuler added more
        sEmptyTable: this.langService.getTranslation("sEmptyTable"),
        sInfo: this.langService.getTranslation("sInfo"),
        sInfoFiltered: this.langService.getTranslation("sInfoFiltered"),
        sInfoEmpty: this.langService.getTranslation("sInfoEmpty"),
        sInfoPostFix: "",
        sDecimal: "",
        sThousands: ",",
        sLoadingRecords: "Loading...",
        sSearchPlaceholder: "",
        sUrl: "",
        sZeroRecords: this.langService.getTranslation("sZeroRecords"),
        oPaginate: {
          sFirst: this.langService.getTranslation("sFirst"),
          sLast: this.langService.getTranslation("sLast"),
          sNext: this.langService.getTranslation("sNext"),
          sPrevious: this.langService.getTranslation("sPrevious")
        },
        oAria: {
          sSortAscending: this.langService.getTranslation("sPrevious"),
          sSortDescending: this.langService.getTranslation("sSortDescending")
        }
      },

      autoWidth: false,
      processing: true,
      retrieve: true,
      responsive: false,
      orderCellsTop: true,
      rowId: 'extn',
      //select: true,//allow on row/col/cell select
      select: {
        style: "single"//select only 1 row
      },
      order: [], //prevent default sort
      initComplete: (settings, json) => {
        // element
        //   .parent()
        //   .find(".input-sm")
        //   .removeClass("input-sm")
        //   .addClass("input-md");
        //this.manage_selects( this );
      }
    });
    if (options.multiSelect) {
      options.select.style = 'multi'
    }
    const _dataTable = element.DataTable(options);

    if (this.filter) {
      // for input[type=text]
      $("thead th input[type=text]").on("keyup change", function () {
        //console.log("Searching text: " + this.value);
        _dataTable
          .column(
            $(this)
              .parent()
              .index() + ":visible"
          )
          .search(this.value)
          .draw();
      });
      //for input has .datepicker
      $(".dataTable .datepicker").on("keyup change", (e: any) => {
        let el = $(e.target);
        // console.log(
        //   "Searching date: " + el.val() + ". Col index:" + el.parent().index()
        // );
        _dataTable
          .column(el.parent().index() + ":visible")
          .search(el.val())
          .draw();
      });
      //for select
      $(".dataTable .select-filter").on("change", (e: any) => {
        let el = $(e.target);
        let searchText;
        if (el.val() != "") {
          searchText = el.children(":selected").text();
        } else {
          searchText = "";
        }
        // console.log(
        //   "Searching select2: " +
        //   searchText +
        //   ". Col index:" +
        //   el.parent().index()
        // );
        _dataTable
          .column(el.parent().index() + ":visible")
          .search(searchText)
          .draw();
      });
    }

    // if (!toolbar) {
    //   element
    //     .parent()
    //     .find(".dt-toolbar")
    //     .append(
    //       '<div class="text-right"><img src="assets/img/logo.png" alt="SmartAdmin" style="width: 111px; margin-top: 3px; margin-right: 10px;"></div>'
    //     );
    // }

    if (this.detailsFormat) {
      let format = this.detailsFormat;
      element.on("click", "td.details-control", function () {
        var tr = $(this).closest("tr");
        var row = _dataTable.row(tr);
        if (row.child.isShown()) {
          row.child.hide();
          tr.removeClass("shown");
        } else {
          row.child(format(row.data())).show();
          tr.addClass("shown");
        }
      });
    }
    if (this.rowClick) {
      element.on("click", "tbody tr", (e: any) => {
        if ($(e.target).is("button.popup") || $(e.target).is("a.popup")) {
          _dataTable.row($(e.target).parent()).deselect();
          return;
        }
        let data = _dataTable.row($(e.target)).data();
        if (data == undefined) {
          return;
        }
        this.rowClick.emit(data);
      });
    }
    if (this.rowDbClick) {
      element.on('dblclick', 'tbody tr', (e: any) => {
        let data = _dataTable.row($(e.target)).data();
        if (data == undefined) {
          return;
        }
        this.rowDbClick.emit(data);
      });
    }
    _dataTable.on("select", function (e, dt, type, indexes) {
      if (type === "row") {
        //_dataTable.rows( indexes ).addClass('selected');
      }
    });
  }

  
  manage_selects ( $dt ) {
    var $api = $dt.api();

    $api.on( 'select', function ( e, dt, type, indexes ) {
        // Add new selected ID to the selected_rows array
        this.selected_rows.push( indexes[ 0 ] );
        console.log('select',this.selected_rows)
    } );

    $api.on( 'deselect', function ( e, dt, type, indexes ) {
        // Remove the row that was deselected, using UnderscoreJS
        this.selected_rows = _.without( this.selected_rows, indexes[ 0 ] );
        console.log('deselect',this.selected_rows)
    } );

    $api.on( 'draw.dt', function () {
        // Select the rows again, since they are de-selected after the re-draw
        $api.rows( _.uniq(this.selected_rows) ).select();
        console.log('draw',this.selected_rows)
    } );
}
}

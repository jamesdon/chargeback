require([
        "splunkjs/mvc",
        "splunkjs/mvc/searchmanager",
        "splunkjs/mvc/dropdownview",
        "splunkjs/mvc/tableview",
        "splunkjs/mvc/simplexml/ready!"
        ], function() {

        var $ = require('jquery');
        // $("div[id*='modal_row").addClass("modal");
        // $("div[id*='modal_row").addClass("fade");
        // $("div[id*='modal_panel").addClass("modal-dialog");
        // $("div[id*='modal_element").addClass("modal-content");
        // $("div[id*='modal_element").children(0).addClass("modal-header");
        // $("div[id*='modal_element").children(1).addClass("modal-body");
        // $("div[id*='modal_element").children(2).addClass("modal-footer");

        $("#modal_row").addClass("modal");
        $("#modal_row").addClass("fade");
        $("#modal_panel").addClass("modal-dialog");
        $("#modal_element").addClass("modal-content");
        $("#modal_element").children(0).addClass("modal-header");
        $("#modal_element").children(1).addClass("modal-body");
        $("#modal_element").children(2).addClass("modal-footer");

});
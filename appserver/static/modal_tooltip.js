require([
    'jquery',
    'underscore',
    'splunkjs/mvc',
    'bootstrap.button',
    'splunkjs/mvc/simplexml/ready!'
], function(
    $,
    _,
    mvc
) {
    // Example HTML taken from http://getbootstrap.com/javascript/#modals
    $("body").append('<div id="my-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3></h3></div><div class="modal-body"></div><div class="modal-footer"><button class="btn" data-dismiss="modal" aria-hidden="true">Close</button></div></div>');

    var EventView = mvc.Components.get('demo_event');
    var TableView = mvc.Components.get('demo_table');

    // 6.1.x will support the 'click' event
    EventView.on('drilldown', function(e) {
        e.preventDefault();

        $("#my-modal div.modal-header h3").html("Event clicking");
        $("#my-modal div.modal-body").html("Unfortunately in Splunk 6.0.x SplunkJS doesn't know the clicked event's values. Itay told me this will be fixed in 6.1.x.");

        $("#my-modal").modal("show");
    });

    TableView.on('click', function(e) {
        e.preventDefault();

        var table_html = $('<table class="table table-striped table-condensed"><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody></tbody></table>');

        $("#my-modal div.modal-body").html(table_html);

        for(var key in e.data) {
            var row_html = $("<tr><td></td><td></td></tr>");

            row_html.find("td:eq(0)").text(key);
            row_html.find("td:eq(1)").text(e.data[key]);

            table_html.find("tbody").append(row_html);
        }

        var ip = e.data['row.clientip'];

        $("#my-modal div.modal-header h3").html("The clicked row's entire object");
        $("#my-modal div.modal-body").html(table_html).append('An example to pass a value to a another dashboard: IP is <a href="ip_detail?form.ip=' + ip + '">' + ip + '</a>.');

        $("#my-modal").modal("show");
    });
});

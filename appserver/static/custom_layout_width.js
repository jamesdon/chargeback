require(['jquery', 'splunkjs/mvc/simplexml/ready!'], function($) {

    // Grab the DOM for the first, second, then third dashboard row
    // Get the dashboard cells (which are the parent elements of the actual panels and define the panel size)
    // Adjust the cells' width

    var panelRow = $('.dashboard-row').first();
    var panelCells = $(panelRow).children('.dashboard-cell');

    panelRow = $(panelRow).next();
    panelCells = $(panelRow).children('.dashboard-cell');

    panelRow = $(panelRow).next();
    panelCells = $(panelRow).children('.dashboard-cell');
    $(panelCells[0]).css('width', '33%');
    $(panelCells[1]).css('width', '67%');

    panelRow = $(panelRow).next();
    panelCells = $(panelRow).children('.dashboard-cell');
    $(panelCells[0]).css('width', '65%');
    $(panelCells[1]).css('width', '35%');

    // Force visualizations (esp. charts) to be redrawn with their new size
    $(window).trigger('resize');

});


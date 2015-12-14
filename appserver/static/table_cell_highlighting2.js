require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView) {

    // Row Coloring Example with custom, client-side range interpretation

    var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            // Enable this custom cell renderer for all fields evaluated below
            return _(['Years Retention','Current GB Used','Max Hot/Warm Size GB','Max Index Size GB','Hot/Warm Calc GB','Hot/Warm Rate','Hot/Warm Storage Cost','Max Cold Size GB','Cold Calc GB','Cold Rate','Cold Storage Cost','Storage Cost','Storage Cost','Replication Factor','Percent Ownership','Total Cost', 'Available License GB']).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var value = parseFloat(cell.value);

            // Apply interpretation for Purple default values
            if (cell.field === 'Max Index Size GB' || cell.field === 'Percent Ownership' || cell.field === 'Replication Factor') {
                if (value >= 0) {
                    $td.addClass('range-cell').addClass('range-orange');
                }
                else if (value < 0) {
                    $td.addClass('range-cell').addClass('range-alert');
                }
                else {
                    $td.addClass('range-cell').addClass('range-low');
                }
            }

            // Apply interpretation for Blue default values
            if (cell.field === 'Max Cold Size GB' || cell.field === 'Cold Calc GB' || cell.field === 'Cold Rate' || cell.field === 'Cold Storage Cost') {
                if (value >= 0) {
                    $td.addClass('range-cell').addClass('range-blue');
                }
                else if (value < 0) {
                    $td.addClass('range-cell').addClass('range-alert');
                }
                else {
                    $td.addClass('range-cell').addClass('range-low');
                }
            }

            // Apply interpretation for Red default values
            if (cell.field === 'Max Hot/Warm Size GB' || cell.field === 'Hot/Warm Calc GB' || cell.field === 'Hot/Warm Rate' || cell.field === 'Hot/Warm Storage Cost') {
                if (value >= 0) {
                    $td.addClass('range-cell').addClass('range-red');
                }
                else if (value < 0) {
                    $td.addClass('range-cell').addClass('range-alert');
                }
                else {
                    $td.addClass('range-cell').addClass('range-low');
                }
            }

            // Apply interpretation for Green default values
            if (cell.field === 'Current GB Used' || cell.field === 'Available License GB' || cell.field === 'Storage Cost' || cell.field === 'Years Retention' || cell.field === 'Total Cost') {
                if (value >= 0) {
                    $td.addClass('range-cell').addClass('range-green');
                }
                else if (value < 0) {
                    $td.addClass('range-cell').addClass('range-alert');
                }
                else {
                    $td.addClass('range-cell').addClass('range-low');
                }
            }

            // Update the cell content
            $td.text(value.toFixed(2)).addClass('numeric');
        }
    });

    mvc.Components.get('highlight2').getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new CustomRangeRenderer());
    });

});

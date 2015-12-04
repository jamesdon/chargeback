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
            return _(['Years Retention','Current GB Used','Hot/Warm Max Data Size GB','Max Storage GB','Hot/Warm Conf GB','Hot/Warm Rate','Hot/Warm Storage Cost','Cold Max Data Size GB','Max Storage GB','Cold Conf GB','Cold Rate','Cold Storage Cost','Storage Cost','Storage Cost','Percent Ownership','Total Cost', 'Unused Lic GB']).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var value = parseFloat(cell.value);

            // Apply interpretation for Purple default values
            if (cell.field === 'Max Storage GB' || cell.field === 'Percent Ownership') {
                if (value >= 0) {
                    $td.addClass('range-cell').addClass('range-purple');
                }
                else if (value < 0) {
                    $td.addClass('range-cell').addClass('range-alert');
                }
                else {
                    $td.addClass('range-cell').addClass('range-low');
                }
            }

            // Apply interpretation for Blue default values
            if (cell.field === 'Cold Max Data Size GB' || cell.field === 'Cold Conf GB' || cell.field === 'Cold Rate' || cell.field === 'Cold Storage Cost') {
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
            if (cell.field === 'Hot/Warm Max Data Size GB' || cell.field === 'Hot/Warm Conf GB' || cell.field === 'Hot/Warm Rate' || cell.field === 'Hot/Warm Storage Cost') {
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
            if (cell.field === 'Current GB Used' || cell.field === 'Unused Lic GB' || cell.field === 'Storage Cost' || cell.field === 'Years Retention' || cell.field === 'Total Cost') {
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

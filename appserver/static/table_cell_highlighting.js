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
            return _(['Disabled','Max Conf GB','License Rate','Percent Ownership','License Cost','Event Count']).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var value = parseFloat(cell.value);

            // Apply interpretation for all of the following fields
            if (cell.field === 'Max Conf GB' || cell.field === 'License Rate' || cell.field === 'Percent Ownership' || cell.field === 'License Cost' || cell.field === 'Event Count') {
                if (value > 0) {
                    $td.addClass('range-cell').addClass('range-green');
                }
                else if (value <= 0){
                    $td.addClass('range-cell').addClass('range-alert');
                }
                else {
                    $td.addClass('range-cell').addClass('range-low');
                }
            }

            // Apply interpretation for Disabled indexes
            if (cell.field === 'Disabled') {
                if (value == '0.00') {
                    $td.addClass('range-cell').addClass('range-green');
                }
                else if (value >= 1){
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

    mvc.Components.get('highlight').getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addCellRenderer(new CustomRangeRenderer());
    });

});

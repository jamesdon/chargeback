require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView) {

    // Field coloring with custom, client-side range interpretation

    var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            // Enable this custom cell renderer for all fields evaluated below
            return _(['Index','Splunk Server', 'App ACL']).contains(cell.field);
        },
        render: function($td, cell) {
            // Add a class to the cell based on the returned value
            var value = String(cell.value);

            // Apply interpretation for all non-numeric fields
	    if (cell.field === 'Index' || cell.field === 'Splunk Server' || cell.field === 'App ACL') {
            	$td.addClass('range-cell').addClass('range-green');
            }

            // Update the cell content
            $td.text(value.toString()).addClass('string');
        }
    });


	    mvc.Components.get('highlight').getVisualization(function(tableView) {
            // Add custom cell renderer
            tableView.table.addCellRenderer(new CustomRangeRenderer());
            tableView.on('rendered', function() {
              // Apply class of the cells to the parent row in order to color the whole row
              tableView.$el.find('td.range-cell').each(function() {
                  $(this).parents('tr').addClass(this.className);
              });
            });
            // Force the table to re-render
            tableView.table.render();
    });

	    mvc.Components.get('highlight2').getVisualization(function(tableView) {
            // Add custom cell renderer
            tableView.table.addCellRenderer(new CustomRangeRenderer());
            tableView.on('rendered', function() {
              // Apply class of the cells to the parent row in order to color the whole row
              tableView.$el.find('td.range-cell').each(function() {
                  $(this).parents('tr').addClass(this.className);
              });
            });
            // Force the table to re-render
            tableView.table.render();
    });

});

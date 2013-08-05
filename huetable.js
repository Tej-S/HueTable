
function HueTable(containerId, dataobj, conf) {
	var row_totals = getRowTotals(dataobj);
	var data = dataobj['data']
	var lightdata = {};
	// set the total values (normalized)
	var max_total = getMaxVal(row_totals);
	var min_total = getMinVal(row_totals);
	for(var i = 0; i < dataobj['rows'].length; i++) {
		var row = dataobj['rows'][i];
		lightdata[row] = {};
		lightdata[row]['TOTAL'] = normalizeToLightness(
			row_totals[row],
			min_total,
			max_total,
			conf['min_lightness'],
			conf['max_lightness']
		);
	}
	// set the cell values
	for(var i = 0; i < dataobj['rows'].length; i++) {
		var row = dataobj['rows'][i];
		if(row in data){			
			var min_row = getMinVal(data[row]);
			var max_row = getMaxVal(data[row]);
			if(min_row == max_row){
				min_row = 0;
			}
			for(var col in data[row]){
				lightdata[row][col] = normalizeToLightness(
					data[row][col],
					min_row,
					max_row,
					conf['min_lightness'],
					conf['max_lightness']
				);
			}
		}
	}
	// reorder rows if sorted
	if(conf['sortrows']){
		for(var i = 0; i < dataobj['rows'].length - 1; i++){
			for(var j = i; j < dataobj['rows'].length; j++){
				if(row_totals[dataobj['rows'][j]] > row_totals[dataobj['rows'][i]]){
					var aux = dataobj['rows'][i];
					dataobj['rows'][i] = dataobj['rows'][j];
					dataobj['rows'][j] = aux;
				}
			}
		}
	}

	// create table HTML
	var html = '<table class="huetable" cellpadding="0" border="0" style="border-collapse:collapse;" cellspacing="0">';
	// header
	/*html += '<tr>';
	html += '<td></td><td class="huehead"><div>TOTAL</div></td>';
	for(var i = 0; i < dataobj['columns'].length; i++){
		var col = dataobj['columns'][i];
		html += '<td class="huehead"><div>' + col + '</div></td>';
	}
	html += '</tr>';*/
	// datarows
	for(var i = 0; i < dataobj['rows'].length; i++){
		var row = dataobj['rows'][i];
		html += '<tr>';
		html += '<td class="rowlabel"><div>' + row + '</div></td>';		
		html += '<td class="totalcell" title="[' + row + ', TOTAL]: ' + row_totals[row] + '"><div style="background-color: hsl(' + conf['totalhue'] + ',' + conf['saturation'] + '%,' + Math.floor(lightdata[row]['TOTAL']) + '%);"></div></td>';
		for(var j = 0; j < dataobj['columns'].length; j++){
			var col = dataobj['columns'][j];
			html += '<td class="huecell" title="[' + row + ', ' + col  + ']: ' + getCell(data, row, col, 0) + '"><div style="background-color: hsl(' + conf['hue'] + ',' + conf['saturation'] + '%,' + Math.floor(getCell(lightdata, row, col, 100)) + '%);"></div></td>';
		}
		html += '</tr>';
	}

	html += '</table>';

	document.getElementById(containerId).innerHTML = html;
}

function getCell(obj, row_label, col_label, default_val) {
	if(!(row_label in obj)){
		return default_val;
	}
	if(!(col_label in obj[row_label])){
		return default_val;
	}
	return obj[row_label][col_label];
}

function getRowTotals(dataobj) {

	var row_totals = {};
	for(var i = 0; i < dataobj['rows'].length; i++){
		var row_label = dataobj['rows'][i];
		row_totals[row_label] = 0;
		if(row_label in dataobj['data']){
			for(var col in dataobj['data'][row_label]){
				row_totals[row_label] += dataobj['data'][row_label][col];
			}
		}
	}
	return row_totals;
}

function normalizeToLightness(value, min_value, max_value, min_lightness, max_lightness){
	if(value < min_value){
		value = min_value;
	}
	if(value > max_value){
		value = max_value;
	}
	var bottom_val = - max_lightness;
	var top_val = - min_lightness;

	var r = (value - min_value) / (max_value - min_value);
	var scaled_val = bottom_val + r * (top_val - bottom_val);
	var projected_val = -scaled_val;

	return projected_val;
}

function getMinVal(dict) {
	var mn = Number.MAX_VALUE;
	for(var key in dict) {
		if(dict[key] < mn){
			mn = dict[key];
		}
	}
	return mn;
}

function getMaxVal(dict) {
	var mx = Number.MIN_VALUE;
	for(var key in dict){
		if(dict[key] > mx){
			mx = dict[key];
		}
	}
	return mx;
}
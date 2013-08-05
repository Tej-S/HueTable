HueTable is used to visualized numeric data as colors in the browser

testdata.js contains soem test data for the demo in
blackboard.html

the HueTable is generated with the following code:
		setTimeout(function(){
			HueTable('huetable_container_id', testdata, {  // testdata is defined in testdata.js
				'min_lightness': 20,
				'max_lightness': 90,
				'totalhue': 0,
				'hue': 120,
				'saturation': 50,
				'sortrows': true
			})
		}, 1000);
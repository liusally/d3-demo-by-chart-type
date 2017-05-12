/* Credits to : http://www.d3noob.org/2012/12/starting-with-basic-d3-line-graph.html */

// Init function
(function($){


	$.ajax({
	    url: 'http://api.worldbank.org/countries/CHN/indicators/NY.GDP.MKTP.KD.ZG?per_page=100&date=1960:2015&format=jsonP&prefix=getdata',
	    dataType: 'jsonp'
	});

	this.getdata = function(response) {
		console.log(response);

		if (response.length > 1) {
			var data = response[1];

			var margin = {top: 30, right: 20, bottom: 30, left: 50},
		    width = 800 - margin.left - margin.right,
		    height = 400 - margin.top - margin.bottom;

		    var parseDate = d3.time.format("%y").parse;

		    var x = d3.time.scale().range([0, width]);
			var y = d3.scale.linear().range([height, 0]);

			var yearFormat = d3.format("d");
			var percentageFormat = function(d) {
				return d + '%';
			}

			var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(5)
			.tickFormat(yearFormat);

			var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(5)
			.tickFormat(percentageFormat);

			var valueline = d3.svg.line()
						    .x(function(d) { return x(d.date); })
						    .y(function(d) { return y(d.value); });

			var svg = d3.select("body")
		    .append("svg")
		        .attr("width", width + margin.left + margin.right)
		        .attr("height", height + margin.top + margin.bottom)
		    .append("g")
		        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		    // Scale the range of the data
		    x.domain(d3.extent(data, function(d) { return Number(d.date); }));
		    y.domain(d3.extent(data, function(d) { return Number(d.value); }));

		    svg.append("path")      // Add the valueline path.
		        .attr("d", valueline(data));

		    /* Initialize tooltip */
			var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { 
				var html = "<b>Year: </b>" + yearFormat(d.date) + "</br>"
				+ "<b>Growth: </b>" + percentageFormat(d.value);
				return html; 
			});

			/* Invoke the tip in the context of your visualization */
			svg.call(tip)


		    svg.selectAll("circle")
		    	.data(data)
		    	.enter()
		    	.append("circle")
		    	.attr("r", 3)
		    	.attr("transform", function(d) {
		    		return "translate(" + x(d.date) + "," + y(d.value) + ")";
		    	})
		    	.on('mouseover', tip.show)
  				.on('mouseout', tip.hide);

		    svg.append("g")         // Add the X Axis
		        .attr("class", "x axis")
		        .attr("transform", "translate(0," + height + ")")
		        .call(xAxis);

		    svg.append("g")         // Add the Y Axis
		        .attr("class", "y axis")
		        .call(yAxis);



			
		}

		
	}


 })(jQuery); 

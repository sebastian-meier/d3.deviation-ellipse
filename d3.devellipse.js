/*global d3:false, jstat:false, numeric:false */
/*jshint unused:false*/

/**
 * Initiate the deviation ellipse library
 * Build upon this: http://plnkr.co/edit/8bONVq?p=preview
 * @constructor
 */
var devellipse = function(opts){

	/**
	* Default attributes
	* @type {object}
	* @defaultvalue
	*/
	var defaults = {
		level: 0.9,
		x: function(d){ return d[0]; },
		y: function(d){ return d[1]; }
	};

	/**
	* visual attributes of the error ellipse
	* @type {object}
	* @defaultvalue
	*/
	var errEllipse = {
		rx: null,
		ry: null,
		cx: null,
		cy: null,
		orient: null
	};

	/**
	* Changing the default attributes
	* @param {object} opts - object with default attributes see "var defaults"
	* @return {object} defaults - the full default object
	*/
	function setDefaults(opts){
		defaults = extend(defaults, opts);
		return defaults;
	}

	setDefaults(opts);

	/**
	* merging two objects, source will replace duplicates in destination
	* @param {object} destination
	* @param {object} source
	*/
	function extend(destination, source) {
		var returnObj = {}, attrname;
		for (attrname in destination) { returnObj[attrname] = destination[attrname]; }
		for (attrname in source) { returnObj[attrname] = source[attrname]; }
		return returnObj;
	}

	/**
	* Create deviation ellipse
	* @constructor
	*/
	function devellipse(){
	}

	/**
	* set the data
	* @param {array} data - [[x,y],[x,y],...] (This depends on the x,y function in the defaults object)
	* @return {object} errEllipse - see default errEllipse
	*/
	devellipse.data = function(d){
		var xData = [], yData = [], data = [], raw_point_data = [];

		//split dataset into x,y
		for(var j = 0; j<d.length; j++){
			xData.push(defaults.x(d[j]));
			yData.push(defaults.y(d[j]));
			raw_point_data.push({
				x:defaults.x(d[j]),
				y:defaults.y(d[j])
			});
			data.push(d[j]);
		}

		//Calculate Statistics
		var stdDevX = d3.deviation(xData),
		xMean = d3.mean(xData),
		xExtent = d3.extent(xData),

		yMean = d3.mean(yData),
		stdDevY = d3.deviation(yData),
		yExtent = d3.extent(yData);

		var cor = jStat.corrcoeff(xData, yData);

		var errEllipse,
			cov = cor * stdDevX * stdDevY,
			covmat = [
				[stdDevX * stdDevX, cov],
				[cov, stdDevY * stdDevY]
			],
			eig = numeric.eig(covmat),
			scale = Math.sqrt(jStat.chisquare.inv(defaults.level, 2)),
			maxLambdaI = indexOfMax(eig.lambda.x),
			minLambdaI = indexOfMin(eig.lambda.x),
			rx = stdDevX > stdDevY ? Math.sqrt(eig.lambda.x[maxLambdaI]) * scale : Math.sqrt(eig.lambda.x[minLambdaI]) * scale,
			ry = stdDevY > stdDevX ? Math.sqrt(eig.lambda.x[maxLambdaI]) * scale : Math.sqrt(eig.lambda.x[minLambdaI]) * scale,
			v1 = eig.E.x[maxLambdaI],
			theta =  Math.atan2(v1[1], v1[0]);

		if (theta < 0) {
			theta += 2 * Math.PI;
		}

		var rotation = -(theta * 180 / Math.PI) + 90;

		if(Math.abs(rotation) < 135){
			rotation -= 90;
		}

		//make the ellipse object
		errEllipse = {
			rx: rx,
			ry: ry,
			cx: xMean,
			cy: yMean,
			orient: rotation
		};

		return errEllipse;
	};

	/**
	* get the index of the maximum
	* @param {array} data - [number,number,...]
	* @return {integer} index
	*/
	var indexOfMax = function(data) {
		var max = data[0],
		index = 0;
		for (var d in data) {
			if (data[d] > max) {
				max = data[d];
				index = d;
			}
		}
		return index;
	};

	/**
	* get the index of the minimum
	* @param {array} data - [number,number,...]
	* @return {integer} index
	*/
	var indexOfMin = function(data) {
		var min = data[0],
		index = 0;
		for (var d in data) {
			if (data[d] < min) {
				min = data[d];
				index = d;
			}
		}
		return index;
	};

	return devellipse;
};
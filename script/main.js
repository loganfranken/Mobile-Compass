window.onload = function() {

	// Set up canvas
	var canvas = document.getElementById('compass');
	paper.setup(canvas);

	// Create compass
	var compass = new Compass();
	compass.draw(paper);

	// Draw compass
	paper.view.draw();
	
	// Initialize device orientation event
	window.addEventListener('deviceorientation', function (event) {
		if(event.alpha)
		{
			var alpha = 360 - event.alpha;
			document.getElementById('status').innerHTML = Math.floor(alpha) + '&deg;';
			compass.setNeedleRotation(alpha);
			paper.view.draw();
		}
	});

};

function Compass(gfx) {
	
	this._currDegrees = null;
	this._center = null;
	this._topNeedle = null;
	this._bottomNeedle = null;
	
};

Compass.prototype.setNeedleRotation = function(degrees) {

	// Bound degree values between 0 and 360
	var convDegrees = (degrees < 0) ? 0
						: (degrees > 360) ? 360
						: degrees;

	// Determine rotation
	var rotation = convDegrees - this._currDegrees;
	
	// Perform the rotation
	this._topNeedle.rotate(rotation, this._center);
	this._bottomNeedle.rotate(rotation, this._center);
	this._currDegrees = convDegrees;

};

Compass.prototype.draw = function(gfx) {

	var viewWidth = gfx.view.viewSize.width;
	var viewHeight = gfx.view.viewSize.height;

	var diameter = (viewWidth > viewHeight) ? viewHeight : viewWidth;
	var radius = diameter/2;

	var outerRadius = radius * 0.8;
	var innerRadius = outerRadius * 0.92;

	var center = this._center = gfx.view.center;
	var centerX = this._center.x;
	var centerY = this._center.y;

	// Outer compass
	var outerCompass = new gfx.Path.Circle(center, outerRadius);
	
	var outerCompassTopY = outerCompass.bounds.y;
	var outerCompassBottomY = outerCompassTopY + outerCompass.bounds.height;
	
	outerCompass.strokeWidth = 2;
	outerCompass.strokeColor = '#ABABAB';
	outerCompass.fillColor = new gfx.GradientColor(
								new gfx.Gradient(['#D6D6D6', '#777']),
								new gfx.Point(centerX, outerCompassTopY),
								new gfx.Point(centerX, outerCompassBottomY)
							);

	// Inner compass
	var innerCompass = new gfx.Path.Circle(center, innerRadius);
	
	var innerCompassCenter = innerCompass.position;
	var innerCompassBottomY = innerCompass.bounds.y + innerCompass.bounds.height;
	
	innerCompass.strokeWidth = 2;
	innerCompass.strokeColor = '#999';
	innerCompass.fillColor = new gfx.GradientColor(
								new gfx.Gradient(
									['#FFF', '#E5FAFC'], 'radial'),
								innerCompassCenter,
								innerCompassBottomY
							);
			
	// Needle		
	var innerCompassY = innerCompass.bounds.y;
	var innerCompassWidth = innerCompass.bounds.width;
	var needleHalfWidth = (innerCompassWidth * 0.1)/2;
	var needleDistance = innerCompassWidth * 0.04;

	var needleTopX = centerX;
	var needleTopY = innerCompassY + needleDistance;

	var needleRightX = needleTopX + needleHalfWidth;
	var needleRightY = centerY;

	var needleBottomX = needleTopX;
	var needleBottomY = innerCompassY + innerCompassWidth - needleDistance;

	var needleLeftX = centerX - needleHalfWidth;
	var needleLeftY = centerY;
							
	// Top Needle
	this._topNeedle = new gfx.Path([
					new gfx.Point(needleTopX, needleTopY), 			// Top
					new gfx.Point(needleRightX, needleRightY),		// Right
					new gfx.Point(needleLeftX, needleLeftY)			// Left
				]);
	this._topNeedle.closed = true;
	this._topNeedle.fillColor = new gfx.GradientColor(
								new gfx.Gradient(
									[['#C00', 0.5], ['#ED0000', 0.5]]),
								new gfx.Point(needleLeftX, centerY),
								new gfx.Point(needleRightX, centerY)
							);

	// Bottom Needle
	this._bottomNeedle = new gfx.Path([
					new gfx.Point(needleRightX, needleRightY),		// Right
					new gfx.Point(needleBottomX, needleBottomY),	// Bottom
					new gfx.Point(needleLeftX, needleLeftY)			// Left
				]);
	this._bottomNeedle.closed = true;
	this._bottomNeedle.fillColor = new gfx.GradientColor(
								new gfx.Gradient(
									[['#CCC', 0.5], ['#E6E6E6', 0.5]]),
								new gfx.Point(needleLeftX, centerY),
								new gfx.Point(needleRightX, centerY)
							);
							
	this._currDegrees = 0;
};

var Geometry = {};

Geometry.normalizeDegrees = function(degrees) {

	var normDegrees = (degrees%360);
	
	if(normDegrees < 0)
	{
		normDegrees = (360 + normDegrees);
	}
	
	return normDegrees;
		
};
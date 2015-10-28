var clockCache = {
	h: 0,
	m: 0,
	s: 0
};

var clockAngles = {
	h: 0,
	m: 0,
	s: 0
};

var timeConstants = {
	sInM:	60,
	mInH:	60,
	totalH:	12
};

function drawClock() {

	var currentMoment = moment();

	var nowInS = currentMoment.seconds();
	var nowInM = currentMoment.minutes();
	var nowInH = currentMoment.hours();

	// Second hand:
	var secCoeff	= nowInS / timeConstants.sInM;

	// Minute hand:
	var minCoeff	= nowInM / timeConstants.mInH;

	// Hour hand:
	var nowIn12H	= nowInH > 12 ? nowInH - 12 : nowInH;
	var hourCoeff	= nowIn12H / timeConstants.totalH;

	return {
		h: hourCoeff,
		m: minCoeff,
		s: secCoeff
	};
}

function cssRotateTransform(element, angle, increment) {

	if ( increment ) {

		var dataAngle 	= element.data("rotation");
		angle			= dataAngle + 1;
	}

	var transform = "rotate(" + angle + "deg)";

	element.css({
		"-webkit-transform":	transform,
		"-moz-transform":		transform
	});

	element.data("rotation", angle);
}

function createClock() {

	var clock 		= drawClock();

	var degInCircle	= 360;
	var degOffset	= 180; // needed because of HTML structure

	var secAngle	= degOffset + (clock.s * degInCircle);
	var minAngle	= degOffset + (clock.m * degInCircle);
	var hourAngle	= degOffset + (clock.h * degInCircle);

	cssRotateTransform($('#sec-hand'), secAngle, false);
	cssRotateTransform($('#min-hand'), minAngle, false);
	cssRotateTransform($('#hour-hand'), hourAngle, false);
}

var added = false;
function addTransformCSS() {

	if ( !added ) {

		var transition = "all 0.5s ease";

		$('#sec-hand').css({
			"-webkit-transition": transition,
			"-moz-transition": transition
		});
		$('#min-hand').css({
			"-webkit-transition": transition,
			"-moz-transition": transition
		});
		$('#hour-hand').css({
			"-webkit-transition": transition,
			"-moz-transition": transition
		});
		
		added = true;
	}
}

// Max variables represent how long in seconds the full rotation takes
// Epsilon variables represent how long in seconds a single degree takes
function updateClock(deltaTimeMS) {

	//addTransformCSS();

	var deltaTimeS	= deltaTimeMS / 1000;

	// Update the cache.
	clockCache.h 	+= deltaTimeS;
	clockCache.m 	+= deltaTimeS;
	clockCache.s 	+= deltaTimeS;

	var degInCircle	= 360;

	// H
	var maxH		= timeConstants.totalH * timeConstants.sInM * timeConstants.mInH;
	var epsilonH	= maxH / degInCircle;

	if ( clockCache.h >= epsilonH ) {
		
		clockAngles.h++;
		clockCache.h = 0;

		cssRotateTransform($('#hour-hand'), clockAngles.h, true);
	}

	// M
	var maxM		= timeConstants.sInM * timeConstants.mInH;
	var epsilonM	= maxM / degInCircle;
	
	if ( clockCache.m >= epsilonM ) {
		
		clockAngles.m++;
		clockCache.m = 0;

		cssRotateTransform($('#min-hand'), clockAngles.m, true);
	}

	// S
	var maxS		= timeConstants.sInM;
	var epsilonS	= maxS / degInCircle;

	if ( clockCache.s >= epsilonS ) {
		
		clockAngles.s++;
		clockCache.s = 0;

		cssRotateTransform($('#sec-hand'), clockAngles.s, true);
	}
}

$(document).ready(function() {

	createClock();

	var deltaTime = 10;
	var updateInt = setInterval(function() {

		//updateClock(deltaTime);
		createClock();

	}, deltaTime);
});



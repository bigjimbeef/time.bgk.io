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

function cssRotateTransform(element, angle) {

	var transform = "rotate(" + angle + "deg)";

	element.css({
		"-webkit-transform":	transform,
		"-moz-transform":		transform
	});

	element.data("rotation", angle);
}

function updateClock() {

	var clock 		= drawClock();

	var degInCircle	= 360;
	var degOffset	= 180; // needed because of HTML structure

	var secAngle	= degOffset + (clock.s * degInCircle);

	// Extra angle added by seconds.
	var maxExtraM	= degInCircle / 60;
	var extraM		= clock.s * maxExtraM;
	var minAngle	= degOffset + (clock.m * degInCircle) + extraM;

	// Extra angle added by minutes.
	var maxExtraH	= degInCircle / 12;
	var extraH		= clock.m * maxExtraH;
	var hourAngle	= degOffset + (clock.h * degInCircle) + extraH;

	cssRotateTransform($('#sec-hand'), secAngle, false);
	cssRotateTransform($('#min-hand'), minAngle, false);
	cssRotateTransform($('#hour-hand'), hourAngle, false);
}

$(document).ready(function() {

	drawClock();

	var deltaTime = 10;
	var updateInt = setInterval(function() {

		updateClock();

	}, deltaTime);
});



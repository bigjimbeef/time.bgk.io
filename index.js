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

Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

var numbersAdded = false;
function addNumbers() {

	var degInCircle = 360;
	var numNumbers	= 12;
	var degPerNum	= degInCircle / numNumbers;
	var degStart	= -90;

	var r = 125;

	for ( var i = 1; i <= numNumbers; ++i ) {

		// degStart rotates 12 to the top.
		var theta = Math.radians(degStart + (i * degPerNum));

		// x = r.cos(t)
		// y = r.sin(theta);
		var x = r * Math.cos(theta);
		var y = r * Math.sin(theta);

		var posStyle = "left: " + x + "px; top: " + y + "px;"

		var rotTheta = Math.radians(i * degPerNum);
		var rotStyle = "-webkit-transform: rotate(" + rotTheta + "rad); -moz-transform: rotate(" + rotTheta + "rad);";

		var el = "<div class='number' style='" + posStyle + rotStyle + "'>" + i + "</div>";
		$('#numbers').append(el);
	}
}

function setTitle() {

	var now = moment().format("HH:mm:ss");

	var curTitle = $('title').text();

	if ( now != curTitle ) {
		$('title').text(now);		
	}
}

$(document).ready(function() {

	if ( !numbersAdded ) {

		addNumbers();

		numbersAdded = true;
	}

	drawClock();

	var deltaTime = 100;
	var updateInt = setInterval(function() {

		updateClock();

		setTitle();

	}, deltaTime);
});



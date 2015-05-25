/* 
* jQuery Flight Indicators plugin
* By Sébastien Matton (seb_matton@hotmail.com)
* Published under GPLv3 License.
* 
* https://github.com/sebmatton/jQuery-Flight-Indicators
*/
(function($) {
	function FlightIndicator( placeholder, type, options ) {
		// Initial configuration
		var attitude = this;
		var settings = $.extend({
			size : 200,
			roll : 0,
			pitch : 0,
			turn : 0,
			/*extend slip ball with yaw, degree and radian conversion*/
			yaw : 0,
            lastYaw : 0,
			degrees : 0,
			radians : 0,
			/*extend slip ball with yaw, degree and radian conversion*/
			heading: 0,
			vario: 0,
			airspeed: 0,
			altitude: 0,
			pressure: 1000,
			showBox : true,
			img_directory : 'https://online.cdot.senecacollege.ca:25080/jQuery-Flight-Indicators/img/'
		}, options );

		var constants = {
			pitch_bound:30,
			vario_bound : 1.95,
			airspeed_bound_l : 0,
			airspeed_bound_h : 160
		}

		// Creation of the instrument
		placeholder.each(function(){
			switch(type){
				case 'heading':
					$(this).html('<div class="instrument heading"><img src="' + settings.img_directory + 'fi_box.svg" class="background box" alt="" /><div class="heading box"><img src="' + settings.img_directory + 'heading_yaw.svg" class="box" alt="" /></div><div class="mechanics box"><img src="' + settings.img_directory + 'heading_mechanics.svg" class="box" alt="" /><img src="' + settings.img_directory + 'fi_circle.svg" class="box" alt="" /></div></div>');
					_setHeading(settings.heading);
				break;
				case 'variometer':
					$(this).html('<div class="instrument vario"><img src="' + settings.img_directory + 'fi_box.svg" class="background box" alt="" /><img src="' + settings.img_directory + 'vertical_mechanics.svg" class="box" alt="" /><div class="vario box"><img src="' + settings.img_directory + 'fi_needle.svg" class="box" alt="" /></div><div class="mechanics box"><img src="' + settings.img_directory + 'fi_circle.svg" class="box" alt="" /></div></div>');
					_setVario(settings.vario);
				break;
				case 'turn_coordinator':
					$(this).html('<div class="instrument turn_coordinator"><img src="' + settings.img_directory + 'fi_box.svg" class="background box" alt="" /><img src="' + settings.img_directory + 'turn_coordinator_full.svg" class="box" alt="" />  <!-- Slip Ball starts here --> <div class="slipBallUnderPanel"><img src="' + settings.img_directory + 'slipBall_rotate.svg" class="panelBallTodo" alt=""  /></div> <!-- Slip Ball ends here --> <div class="turn box"><img src="' + settings.img_directory + 'fi_tc_airplane.svg" class="box" alt="" /></div><div class="mechanics box"><img src="' + settings.img_directory + 'fi_circle.svg" class="box" alt="" /></div></div> <!-- Front Panel added here --> <div class="panelOverSlipBall"><img src="' + settings.img_directory + '/turn_coordinator_front_panel.svg" class="panelTodo" alt=""></div> <!-- End of Front Panel add -->');
					_setTurn(settings.turn);
					_setYaw(settings.yaw);
					_getRadians(settings.degrees);
					_getDegrees(settings.radians);
				break;
				case 'airspeed':
					$(this).html('<div class="instrument airspeed"><img src="' + settings.img_directory + 'fi_box.svg" class="background box" alt="" /><img src="' + settings.img_directory + 'speed_mechanics.svg" class="box" alt="" /><div class="speed box"><img src="' + settings.img_directory + 'fi_needle.svg" class="box" alt="" /></div><div class="mechanics box"><img src="' + settings.img_directory + 'fi_circle.svg" class="box" alt="" /></div></div>');
					_setAirSpeed(settings.airspeed);
				break
				case 'altimeter':
					$(this).html('<div class="instrument altimeter"><img src="' + settings.img_directory + 'fi_box.svg" class="background box" alt="" /><div class="pressure box"><img src="' + settings.img_directory + 'altitude_pressure.svg" class="box" alt="" /></div><img src="' + settings.img_directory + 'altitude_ticks.svg" class="box" alt="" /><div class="needleSmall box"><img src="' + settings.img_directory + 'fi_needle_small.svg" class="box" alt="" /></div><div class="needle box"><img src="' + settings.img_directory + 'fi_needle.svg" class="box" alt="" /></div><div class="mechanics box"><img src="' + settings.img_directory + 'fi_circle.svg" class="box" alt="" /></div></div>');
					_setAltitude(settings.altitude);
					_setPressure(settings.pressure);
				break;
				default:
					$(this).html('<div class="instrument attitude"><img src="' + settings.img_directory + 'fi_box.svg" class="background box" alt="" /><div class="roll box"><img src="' + settings.img_directory + 'horizon_back.svg" class="box" alt="" /><div class="pitch box"><img src="' + settings.img_directory + 'horizon_ball.svg" class="box" alt="" /></div><img src="' + settings.img_directory + 'horizon_circle.svg" class="box" alt="" /></div><div class="mechanics box"><img src="' + settings.img_directory + 'horizon_mechanics.svg" class="box" alt="" /><img src="' + settings.img_directory + 'fi_circle.svg" class="box" alt="" /></div></div>');
					_setRoll(settings.roll);
					_setPitch(settings.pitch);
			}
			$(this).find('div.instrument').css({height : settings.size, width : settings.size});
			$(this).find('div.instrument img.box.background').toggle(settings.showBox);
		});

		// Private methods
		function _setRoll(roll){
			placeholder.each(function(){
				$(this).find('div.instrument.attitude div.roll').css('transform', 'rotate('+roll+'deg)');
			});
		}

		function _setPitch(pitch){
			// alert(pitch);
			if(pitch>constants.pitch_bound){pitch = constants.pitch_bound;}
			else if(pitch<-constants.pitch_bound){pitch = -constants.pitch_bound;}
			placeholder.each(function(){
				//$(this).find('div.instrument.attitude div.roll div.pitch').css('top', pitch*0.7 + '%');
				$(this).find('div.instrument.attitude div.roll div.pitch').css('-webkit-transform', "translate(0px,+"+pitch*0.7+"px)");
				$(this).find('div.instrument.attitude div.roll div.pitch').css('-ms-transform', "translate(0px,+"+pitch*0.7+"px)");
				$(this).find('div.instrument.attitude div.roll div.pitch').css('transform', "translate(0px,+"+pitch*0.7+"px)");
			});
		}

		function _setHeading(heading){
			placeholder.each(function(){
				$(this).find('div.instrument.heading div.heading').css('transform', 'rotate(' + -heading + 'deg)');
			});	
		}

		function _setTurn(turn){
			placeholder.each(function(){
				$(this).find('div.instrument.turn_coordinator div.turn').css('transform', 'rotate('+turn+'deg)');
			});
		}

		function _setVario(vario){
			if(vario > constants.vario_bound){vario = constants.vario_bound;}
			else if(vario < -constants.vario_bound){vario = -constants.vario_bound;}
			vario = vario*90;
			placeholder.each(function(){
				$(this).find('div.instrument.vario div.vario').css('transform', 'rotate(' + vario + 'deg)');
			});	
		}

		function _setAirSpeed(speed){
			if(speed > constants.airspeed_bound_h){speed = constants.airspeed_bound_h;}
			else if(speed < constants.airspeed_bound_l){speed = constants.airspeed_bound_l;}
			speed = 90+speed*2;
			placeholder.each(function(){
				$(this).find('div.instrument.airspeed div.speed').css('transform', 'rotate(' + speed + 'deg)');
			});	
		}

		function _setAltitude(altitude){
			var needle = 90 + altitude%1000 * 360 / 1000;
			var needleSmall = altitude / 10000 * 360;
			placeholder.each(function(){
				$(this).find('div.instrument.altimeter div.needle').css('transform', 'rotate(' + needle + 'deg)');
				$(this).find('div.instrument.altimeter div.needleSmall').css('transform', 'rotate(' + needleSmall + 'deg)');
			});	
		}

		function _setPressure(pressure){
			pressure = 2*pressure - 1980;
			placeholder.each(function(){
				$(this).find('div.instrument.altimeter div.pressure').css('transform', 'rotate(' + pressure + 'deg)');
			});	
		}

		function _resize(size){
			placeholder.each(function(){
				$(this).find('div.instrument').css({height : size, width : size});
			});
		}

		function _showBox(){
			placeholder.each(function(){
				$(this).find('img.box.background').show();
			});
		}

		function _hideBox(){
			placeholder.each(function(){
				$(this).find('img.box.background').hide();
			});
		}
		
		/*extending flight indicator js with slipball support*/
		function _setYaw(yaw){
            //this.yaw = yaw;
            //console.log("last yaw start: " + settings.lastYaw);
            //settings.lastYaw = yaw;
            if(yaw < -20){
                yaw = -20;
            }

            if(yaw > 20){
                yaw = 20;
            }

            /*
            if(settings.lastYaw * 10 < yaw && yaw !== 0 && settings.lastYaw !==0){
                yaw = settings.lastYaw * 10;
            }

            if(settings.lastYaw / 10 > yaw && settings.lastYaw !== 0 && yaw !== 0){
                yaw = settings.lastYaw / 10;
            }
            */
            var rotation = function(){
                $(".panelBallTodo").rotate({
                    angle: yaw, 
                    animateTo: settings.lastYaw, 
                    easing: function(x,t,b,c,d){
                        return c*(t/(d*10))+b;
                    }
                });
            }

            rotation();

            settings.lastYaw = yaw;
            //console.log("last yaw end: " + settings.lastYaw);
		}
		
		// Convert degrees to radians
		function _getRadians(degrees) {
			return degrees * Math.PI / 180;
		}
		 
		// Convert radians to degrees
		function _getDegrees(radians) {
			return radians * 180 / Math.PI;
		}	
		
		/*slipBall support ends here*/

		// Public methods
		this.setRoll = function(roll){_setRoll(roll);}
		this.setPitch = function(pitch){_setPitch(pitch);}
		this.setHeading = function(heading){_setHeading(heading);}
		this.setTurn = function(turn){_setTurn(turn);}
		this.setVario = function(vario){_setVario(vario);}
		this.setAirSpeed = function(speed){_setAirSpeed(speed);}
		this.setAltitude = function(altitude){_setAltitude(altitude);}
		this.setPressure = function(pressure){_setPressure(pressure);}
		this.resize = function(size){_resize(size);}
		this.showBox = function(){_showBox();}
		this.hideBox = function(){_hideBox();}
		
		/*slipBall private methods*/
		this.setYaw = function(yaw){_setYaw(yaw);}
		this.getRadians = function(degrees){return _getRadians(degrees);}		// I need to return the value that we are getting!!!
		this.getDegrees = function(radians){return _getDegrees(radians);}
		/*end of slipBall private methods*/
		
		return attitude;
	};

	// Extension to jQuery
	$.flightIndicator = function(placeholder, type, options){
		var flightIndicator = new FlightIndicator($(placeholder), type, options)
		return flightIndicator;
	}

	$.fn.flightIndicator = function(data, type, options){
		return this.each(function(){
			$.flightIndicator(this, type, options);
		});
	}
}( jQuery ));

var FP = FP || {};

FP.Rounding = {
	CEILING: { type: "CEILING", op: Math.ceiling },
	FLOOR: { type: "FLOOR", op: Math.floor },
	ROUND: { type: "ROUND", op: Math.round }
};

FP.Rounding.DEFAULT = FP.Rounding.ROUND;

FP.Decimal = function(value) {
	"use strict";
	"use restrict";

	var checkNumeric = function(value) {
			if (typeof(value) === "string" && value.search(/[^0-9.]/) > -1)	{
				throw new TypeError("Strings passed can only include numbers and decimal point");
			}
		},
	 	typeTest = function(other) {
			typeTestProperties(other.value, other.scale);
		},
		typeTestProperties = function(otherValue, otherScale) {
			if (typeof(otherValue) === "undefined" || typeof(otherScale) === "undefined")
			{
				throw new TypeError("All operations expects FP.Decimal objects to be passed");
			}
		},
		_value = 0,
		_scale = 0;

	checkNumeric(value);

	if (arguments.length === 2 && typeof(arguments[0]) === "number" && typeof(arguments[1]) === "number") {
		_value = arguments[0];
		_scale = arguments[1];
	}
	else {
		if (typeof(value) === "number") {
			value = value.toString();
		}
		if (typeof(value) === "string") {
			if (value.indexOf(".") > 0) {
				_value = (+value.replace("\.",""));
				_scale = (value.length - value.indexOf(".") - 1);
			}
			else {
				_value = (+value);
				_scale = 0;
			}
		}
	}

	return {
		value: function() { return _value; },

		scale: function() { return _scale; },

		scaleTo: function(newScale, roundingType) {
			roundingType = roundingType || FP.Rounding.DEFAULT;
			if (newScale >= _scale) {
				var addedZeroes = newScale - _scale,
					extraZeroes = "",
					str = _value.toString();
				for(var i=0; i<addedZeroes; i++)
					extraZeroes += "0";
				str = str + extraZeroes;
				return new FP.Decimal((+str),newScale);
			}
			else {
				var truncatedDigits = _scale - newScale,
					str = _value.toString(),
					roundingVal = (+str[str.length - truncatedDigits]),
					newValue = _value;
				str = str.substring(0,str.length-truncatedDigits);

				if(FP.Rounding.CEILING === roundingType) {
					newValue = (+str)+1;
				}
				else if (FP.Rounding.ROUND === roundingType) {
					if(roundingVal >= 5) {
						newValue = (+str)+1;
					}
					else {
						newValue = (+str);
					}
				}
				else {
					newValue = (+str);
				}

				return new FP.Decimal(newValue,newScale);
			}
		},

		add: function(other) {
			if (typeof(other) === "number" || typeof(other) == "string") {
				other = new FP.Decimal(other);
			}
			typeTest(other);

			var that = this;
			if (other.scale() > _scale)
			{
				that = this.scaleTo(other.scale());
			}
			else if (_scale > other.scale())
			{
				other = other.scaleTo(_scale);
			}

			return new FP.Decimal(that.value()+other.value(),that.scale());
		},

		equals: function(other) {
			return typeof other !== 'undefined' &&
			        other !== null &&
			        this.value() === other.value() && 
			        this.scale() === other.scale();
    	},

		toString: function() {
			var str = _value.toString(),
				posn = str.length - _scale;
			return str.substring(0,posn) || 0 + "." + str.substring(posn);
		}
	};
};

FP.Decimal.valueOf = function(value) {
	return new FP.Decimal(value);
};



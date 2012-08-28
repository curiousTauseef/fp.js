if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([], function () {
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
			typeConversion = function(other) {
				if (typeof(other) === "number" || typeof(other) == "string") {
					other = new FP.Decimal(other);
				}
				typeTest(other);
				return other;
			},
			normalizeScale = function(that, other) {
				if (other.scale() > _scale)
				{
					that = that.scaleTo(other.scale());
				}
				else if (_scale > other.scale())
				{
					other = other.scaleTo(_scale);
				}
				return {that: that, other: other};
			},
			normalizeValue = function(value) {
				var val = 0,
					scl = 0;

				if (typeof(value) !== "string") {
					value = value.toString();
				}

				if (value.indexOf(".") > 0) {
					val = (+value.replace("\.",""));
					scl = (value.length - value.indexOf(".") - 1);
				}
				else {
					val = (+value);
					scl = 0;
				}
				return { value: val, scale: scl };
			},
			max = function(one, two) {
				return (one >= two) ? one : two;
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
				var result = normalizeValue(value);
				_value = result.value;
				_scale = result.scale;
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
				var that = this,
					other = typeConversion(other),
					normalized = normalizeScale(that,other);

				return new FP.Decimal(normalized.that.value()+normalized.other.value(),normalized.that.scale());
			},

			subtract: function(other) {
				var that = this,
					other = typeConversion(other),
					normalized = normalizeScale(that,other);

				return new FP.Decimal(normalized.that.value()-normalized.other.value(),normalized.that.scale());
			},

			multiply: function(other) {
				var that = this,
					other = typeConversion(other);

				return new FP.Decimal(that.value()*other.value(),that.scale()+other.scale());
			},

			divide: function(other) {
				var that = this,
					other = typeConversion(other),
					normalized = normalizeScale(that,other);

				normalized = normalizeValue(normalized.that.value()/normalized.other.value());

				var	result = new FP.Decimal(normalized.value,normalized.scale);

				return result.scaleTo(max(that.scale(),other.scale()));
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

	return FP;
});


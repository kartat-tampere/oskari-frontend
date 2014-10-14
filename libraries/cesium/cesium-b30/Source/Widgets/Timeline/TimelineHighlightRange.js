/*global define*/
define([
        '../../Core/defaultValue',
        '../../Core/JulianDate'
    ], function(
        defaultValue,
        JulianDate) {
    "use strict";

    function TimelineHighlightRange(color, heightInPx, base) {
        this._color = color;
        this._height = heightInPx;
        this._base = defaultValue(base, 0);
    }

    TimelineHighlightRange.prototype.getHeight = function() {
        return this._height;
    };

    TimelineHighlightRange.prototype.getBase = function() {
        return this._base;
    };

    TimelineHighlightRange.prototype.getStartTime = function() {
        return this._start;
    };

    TimelineHighlightRange.prototype.getStopTime = function() {
        return this._stop;
    };

    TimelineHighlightRange.prototype.setRange = function(start, stop) {
        this._start = start;
        this._stop = stop;
    };

    TimelineHighlightRange.prototype.render = function(renderState) {
        var range = '';
        if (this._start && this._stop && this._color) {
            var highlightStart = JulianDate.getSecondsDifference(this._start, renderState.epochJulian);
            var highlightLeft = Math.round(renderState.timeBarWidth * renderState.getAlpha(highlightStart));
            var highlightStop = JulianDate.getSecondsDifference(this._stop, renderState.epochJulian);
            var highlightWidth = Math.round(renderState.timeBarWidth * renderState.getAlpha(highlightStop)) - highlightLeft;
            if (highlightLeft < 0) {
                highlightWidth += highlightLeft;
                highlightLeft = 0;
            }
            if ((highlightLeft + highlightWidth) > renderState.timeBarWidth) {
                highlightWidth = renderState.timeBarWidth - highlightLeft;
            }
            if (highlightWidth > 0) {
                range = '<span class="cesium-timeline-highlight" style="left: ' + highlightLeft.toString() +
                        'px; width: ' + highlightWidth.toString() + 'px; bottom: ' + this._base.toString() +
                        'px; height: ' + this._height + 'px; background-color: ' + this._color + ';"></span>';
            }
        }
        return range;
    };

    return TimelineHighlightRange;
});
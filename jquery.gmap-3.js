/**
 * @author Thomas <thansen@solire.fr>
 * @licence Solire <http://www.solire.fr>
 */
(function($){
    var ATTR = 'gmap-id',
        maps = {};

    $.fn.gmap = function(givenParams){
        if (givenParams == null
            && this.attr(ATTR) != null
        ) {
            return maps[this.attr(ATTR)];
        }

//        new google.maps.LatLng(0, -180),
        var defaultParams = {
                center: {
                    lat : 0,
                    lng : -180
                },
                zoom: 15,

//                styles : myStyles,
//                disableDefaultUI: true,

                streetViewControl : false,
                panControl : false,
                overviewMapControl : false,
                disableDoubleClickZoom : true,

                mapTypeId: google.maps.MapTypeId.ROADMAP
//                mapTypeId: google.maps.MapTypeId.HYBRID
            },
            params = $.extend({}, defaultParams, givenParams),
            center = params.center,
            firstMap = null;

        if (typeof center.lat != 'function') {
            params.center = new google.maps.LatLng(center.lat, center.lng);
        }

        /**
         * Génère une chaine alphanumérique aléatoire
         *
         * @param {int} length
         *
         * @returns {String}
         */
        function randomString(length)
        {
            var text        = '', i = 0,
                possible    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                            + 'abcdefghijklmnopqrstuvwxyz'
                            + '0123456789';

            for(i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        }

        /**
         * Génére un attribut id unique (pour element HTML)
         *
         * @param {String} attr
         * @param {String} prefixe
         *
         * @return {String}
         */
        function randomAttr(attr, prefixe)
        {
            do{
                tmpId = randomString(10);
            } while ($('[' + attr + '="' + prefixe + tmpId + '"]').length > 0)

            return prefixe + tmpId;
        }

        /**
         *
         * @param {DOMObject} mapDiv
         * @param {Object}    settings
         *
         * @returns {google.maps.Map}
         */
        function buildMap(mapDiv, settings)
        {
            return new google.maps.Map(mapDiv, settings);
        }

        function buildClass(map)
        {
            var mapClass = {
                map : map,
                markers : {},
                infoWindows : {},
                count : 0,
                addMarker : function(lat, lng, content){
                    var latLng = new google.maps.LatLng(lat, lng),
                        marker = new google.maps.Marker({
                            map         : map,
                            position    : latLng
                        }),
                        infoWindow = null;

                    if (typeof content != "undefined" && content != null) {
                        infoWindow = new google.maps.InfoWindow({
                            content     : content,
                            position    : latLng
                        });

                        this.infoWindows[this.count] = infoWindow;

                        google.maps.event.addListener(marker, 'click', function(e) {
                            infoWindow.open(this.map);
                        });
                    }

                    this.markers[this.count] = marker;

                    this.count++;

                    return marker;
                }
            }

            return mapClass;
        }

        this.each(function(){
            var base = this,
                jBase = $(base),
                currentParams = $.extend({}, params, {
                    center : null
                }),
                uniqueId = randomAttr(ATTR, 'solire-jquery-gmap-'),
                map,
                mapClass;

            jBase.attr(ATTR, uniqueId);

            currentParams.center = new google.maps.LatLng(params.center.lat(),
                params.center.lng());

            map = buildMap(base, currentParams);
            mapClass = buildClass(map);

            if (firstMap == null) {
                firstMap = mapClass;
            }

            maps[uniqueId] = mapClass;
       });

       return firstMap;
    }
})(jQuery);

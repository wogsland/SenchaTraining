/**
 * A wrapper around a Google map.
 * Use setLocation() to center the map
 * Use setBusiness() to highlight a marker
 */
Ext.define('Shared.view.Map', {
    extend: 'Ext.Component',

    //==== START Ext.mixin.Mashup code ====//


    mixins: ['Ext.mixin.Mashup'],
    requiredScripts: ['http://www.google.com/jsapi'],

    constructor: function(config) {
        this.callParent(arguments);
        google.load("maps", "3.x", {
            other_params: "sensor=false&libraries=visualization,geometry",
            callback: Ext.emptyFn
        });
    },


    //==== END Ext.mixin.Mashup code ====//

    renderConfig: {
        store: null,
        business: null,
        location: null
    },
    publishes: ['business'],

    padding: 8,

    html: '<p>Please select a school.</p>',

    applyStore: function(store) {
        if (Ext.isString(store)) {
            store = Ext.getStore(store);
        }
        return store;
    },
    updateStore: function(store) {
        if (store) {
            var me = this;
            this.getStore().on('datachanged', function(store) {
                me.setMarkers(store);
            }, me);
        }
    },

    updateLocation: function(location) {
        if (!location) {
            return;
        }
        // If we're visible, render the map right away. Else
        // wait until someone clicks on the tab.
        if (this.isVisible()) {
            this.renderMap();
        } else {
            this.on('show', this.renderMap, this, {
                single: true
            });
        }
    },

    updateBusiness: function(business) {
        var markers = this.getMarkers();
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            if (marker.business === business) {
                marker.setIcon('resources/images/yellow-dot.png');
                this.fireEvent('select', this, business);
            } else {
                marker.setIcon('resources/images/red-dot.png');
            }
        }
    },

    // @private
    renderMap: function() {
        // Assert : centerMap() has been run, and therefore, 
        // this.latitude and this.longitude are set.
        var p = this.getLocation();
        this.map = this.map || new google.maps.Map(this.getEl().dom, {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this.map.panTo({
            lat: p.latitude,
            lng: p.longitude
        });
        this.renderMarkers();
    },
    // @private
    getMarkers: function() {
        return (this.markers || []);
    },
    // @private
    setMarkers: function(businesses) {
        // Hide the previously saved markers
        var markers = this.getMarkers();
        Ext.Array.forEach(markers, function(marker) {
            marker.setMap(null);
        });

        this.markers = [];

        // For each business, push a new marker onto the array
        var me = this;
        businesses.each(function(business) {
            var ll = new google.maps.LatLng(business.data.latitude, business.data.longitude);
            var marker = new google.maps.Marker({
                position: ll,
                title: business.data.name,
                icon: 'resources/images/red-dot.png',
                business: business
            });
            me.markers.push(marker);
            google.maps.event.addListener(marker, "click", function() {
                me.fireEvent('select', me, business);
                me.setBusiness(business);
            });
        });

        // If we're visible, render the markers right away. Else
        // wait until someone clicks on the tab.
        if (this.isVisible()) {
            this.renderMarkers();
        } else {
            this.on('show', this.renderMarkers, this, {
                single: true
            });
        }

    },
    // @private
    renderMarkers: function() {
        // This method must always be run after setMarkers()
        // Assert: this.map is set.
        var me = this;
        Ext.Array.forEach(this.getMarkers(), function(marker) {
            marker.setMap(me.map);
        });
    }

});
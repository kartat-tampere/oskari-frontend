Oskari.clazz.define('Oskari.mapframework.publisher.tool.ClassificationTool',
function() {
}, {
    index : 1,
    group: 'data',
    allowedLocations : [],
    allowedSiblings : [],

    groupedSiblings : false,

    /**
     * Initialize tool
     * @params {} state data
     * @method init
     * @public
     */
    init: function (pdata) {
        var me = this;

        if (pdata && Oskari.util.keyExists(pdata, 'configuration.statsgrid.conf') && pdata.configuration.statsgrid.conf.allowClassification !== false) {
            me.setEnabled(true);
        } else {
            me.setEnabled(false);
        }
    },
    /**
    * Get tool object.
     * @params {}  pdta.configuration.publishedgrid.state
    * @method getTool
    * @private
    *
    * @returns {Object} tool
    */
    getTool: function(pdata){
        var me = this;
        if(!me.__tool) {
            me.__tool = {
                id: 'Oskari.statistics.statsgrid.StatsGridBundleInstance',
                title: 'allowClassification',
                config: {
                    allowClassification: false
                }
            };
         }
        return me.__tool;
    },
    /**
    * Get stats layer.
    * @method @private _getStatsLayer
    *
    * @return founded stats layer, if not found then null
    */
    _getStatsLayer: function(){
        var me = this,
            selectedLayers = me.__sandbox.findAllSelectedMapLayers(),
            statsLayer = null,
            layer;
        for (i = 0; i < selectedLayers.length; i += 1) {
            layer = selectedLayers[i];
            if (layer.getLayerType() === 'stats') {
                statsLayer = layer;
                break;
            }
        }
        return statsLayer;
    },
    /**
    * Set enabled.
    * @method setEnabled
    * @public
    *
    * @param {Boolean} enabled is tool enabled or not
    */

    setEnabled : function(enabled) {
        var me = this,
            tool = me.getTool(),
            statsLayer = me._getStatsLayer(),
            request;

        if(typeof enabled !== 'boolean') {
            enabled = false;
        }

        me.state.enabled = enabled;

        var stats = Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
        if(stats) {
            stats.classificationVisible(enabled);
        }
    },
    /**
    * Is displayed.
    * @method isDisplayed
    * @public
    *
    * @returns {Boolean} is tool displayed
    */
    isDisplayed: function() {
        var me = this,
            statsLayer = me._getStatsLayer();
        return statsLayer !== null;
    },
    getValues: function() {
        var me = this,
            statsGridState = me.__sandbox.getStatefulComponents().statsgrid.getState();
        // just to make sure if user removes the statslayer while in publisher
        // if there is no statslayer on map -> don't setup publishedgrid
        // otherwise always return the state even if grid is not selected so
        //  publishedgrid gets the information it needs to render map correctly
        var statslayerOnMap = this._getStatsLayer();
        if(statslayerOnMap && statsGridState) {
            // without view = true -> the sidepanel is not shown when the statsgrid bundle starts
            statsGridState.view = me.state.enabled;
            return {
                configuration: {
                    statsgrid: {
                        conf : {
                            allowClassification: me.state.enabled
                        }
                    }
                }
            };
        } else {
            return {};
        }
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});
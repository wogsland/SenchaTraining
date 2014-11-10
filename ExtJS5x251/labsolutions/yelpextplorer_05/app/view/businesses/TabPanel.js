Ext.define("YelpExtplorer.view.businesses.TabPanel", {
  extend: "Ext.tab.Panel",
  xtype: 'businessestabpanel',

  requires: [
    'YelpExtplorer.view.businesses.Map',
    'YelpExtplorer.view.businesses.View',
    'YelpExtplorer.view.businesses.Grid'
  ],

  items: [{
    title: 'Map',
    xtype: 'businessesmap',
    bind: {
      location: '{location}'
    }
  }, {
    title: 'View',
    xtype: 'businessesview'
  }, {
    title: 'Grid',
    xtype: 'businessesgrid'
  }]

});
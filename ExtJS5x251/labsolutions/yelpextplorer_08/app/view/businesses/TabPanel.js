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
      location: '{location}',
      store: '{businesses}',
      business: '{business}'
    }
  }, {
    title: 'View',
    xtype: 'businessesview',
    bind: {
      store: '{businesses}',
      selection: '{business}'
    }
  }, {
    title: 'Grid',
    xtype: 'businessesgrid'
  }]

});
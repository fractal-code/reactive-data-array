Package.describe({
  name: 'talos:reactive-data-array',
  version: '3.0.0',
  summary: 'Create reactive arrays that track cursor data',
  git: 'https://github.com/talos-code/reactive-data-array'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  
  api.addFiles('reactive-data-array.js');
  api.export("ReactiveDataArray");
});
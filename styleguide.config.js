const path = require('path');

module.exports = {
  title: 'Midgard React API Documentation',
  pagePerSection: true,
  // sections: [ {
  //   name: 'Test section 1',
  //   description: 'Test secion 1 description',
  //   components: function () {
  //     return glob.sync(path.resolve(__dirname, 'src/**/*.tsx'))
  //       .filter(function (module) {
  //         return /\/[A-Z]\w*\.tsx$/.test(module);
  //       });
  //   },
  // }, {
  //   name: 'Test secion 2',
  //   description: 'Test section 2 description'
  // }],
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  propsParser: require('react-docgen-typescript').withDefaultConfig({ propFilter: { skipPropsWithoutDoc: true } }).parse,
  sections: [
    // {
    //   name: 'Components',
    //   components: [
    //     'src/midgard/components/**/*.js',
    //   ],
    // },
    // {
    //   name: 'Layout',
    //   components: [
    //     'src/midgard/layout/**/*.js',
    //   ],
    // },
    // {
    //   name: 'Pages',
    //   components: [
    //     'src/midgard/pages/**/*.js',
    //   ],
    // },
    // {
    //   name: 'Clients',
    //   components: [
    //     'src/clients/**/src/*.js',
    //     'src/clients/**/src/components/**/*.js',
    //   ],
    // },
    {
      name: 'Modules',
      description: 'Midgard React Core Modules',
      components: [
        'src/midgard/modules/**/*.tsx',
        'src/midgard/modules/**/*.js',
      ],
    },
  ],
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide/Wrapper')
  }
}

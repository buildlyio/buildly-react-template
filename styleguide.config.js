module.exports = {
  propsParser: require('react-docgen-typescript').withDefaultConfig().parse,
  sections: [
    {
      name: 'Components',
      components: [
        'src/midgard/components/**/*.js',
      ],
    },
    {
      name: 'Layout',
      components: [
        'src/midgard/layout/**/*.js',
      ],
    },
    {
      name: 'Pages',
      components: [
        'src/midgard/pages/**/*.js',
      ],
    },
    {
      name: 'Clients',
      components: [
        'src/clients/**/src/*.js',
        'src/clients/**/src/components/**/*.js',
      ],
    },
    {
      name: 'Modules',
      components: [
          'src/midgard/modules/**/*.tsx'
      ],
    },
  ]
}

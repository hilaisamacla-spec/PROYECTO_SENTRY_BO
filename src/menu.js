function createAppMenu() {
  return [
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' }
      ]
    }
  ];
}

module.exports = { createAppMenu };

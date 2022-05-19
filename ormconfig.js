var dbConfig = {
  synchronize: false,
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entities.js'],
      synchronize: false,
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entities.ts'],
      synchronize: false,
    });
    break;
  case 'production':
  default:
    throw new Error('Unknown error');
}

module.exports = dbConfig;

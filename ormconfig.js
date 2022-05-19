var dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
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
      migrationsRun: true,
      entities: ['**/*.entities.js'],
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
    });
    break;
  default:
    throw new Error('Unknown error');
}

module.exports = dbConfig;

import knex from 'knex';

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: ('database.db'),
    },
    useNullAsDefault: true,
});

export default connection;
import {createPool} from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'auth_tut',
  port: 8889,
});

export default pool;
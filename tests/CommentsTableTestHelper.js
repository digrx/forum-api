/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-147147',
    content = 'Apakah ada tips bagaimana menekan tombol tombol tersebut bersamaan?',
    owner = 'hanif',
    thread = 'thread-147147',
    date = new Date('2023-07-04 16:15:40'),
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, content, owner, thread, date],
    };

    await pool.query(query);
  },

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET deleted = true WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;

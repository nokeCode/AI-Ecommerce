const { getEmbedding } = require('../config/embedding');

async function test() {

  const embedding =
    await getEmbedding(
      'bureau de conférence'
    );

  console.log(
    'Dimension =',
    embedding.length
  );
}

test();
const { getEmbedding } = require('../config/embedding');

async function test() {

  const embedding =
    await getEmbedding(
      'Chaussure de sport confortable'
    );

  console.log(
    'Dimension =',
    embedding.length
  );
}

test();
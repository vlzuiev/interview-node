import dotenv from 'dotenv';

// Setup command line options
try {
  const result2 = dotenv.config({
    path: '.env',
  });

  if (result2.error) {
    throw result2.error;
  }
} catch (e) {}

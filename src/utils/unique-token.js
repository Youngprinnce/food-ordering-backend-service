function generateToken(length) {
  // generate token of random numbers
  let text = '';
  const possible = '0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

module.exports = generateToken;

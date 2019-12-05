if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb+srv://peter2c:07038620466@gettingstartedmoviejot-857b3.mongodb.net/test?retryWrites=true&w=majority'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}
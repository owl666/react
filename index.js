const express = require('express');
require('./services/passport');

const app = express();

require('./routes/authRoutes')(app);

app.get('/', (req, res) => {
	res.send('<h1>Emaily</h1>');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
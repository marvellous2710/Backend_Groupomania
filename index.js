const express    = require('express');
const cors       = require('cors');
const router     = require("./routes/user");
const thread     = require("./routes/thread");
const categories = require("./routes/category");
const path       = require('path');
const PORT       = process.env.PORT || 4000;
const app        = express();


//Security
app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/users', router);
app.use('/threads', thread);

app.use('/category', categories);
app.use('/typeMessage', categories);

app.listen(PORT,() => console.log('Server running on port ' + PORT));






const express = require('express');
const prepare = require('./prepare');
const app = express();

app.use(express.json());
app.use('/', prepare);
app.use((error) => {
    console.log(error);
});

//listenning to port
const port = process.env.PORT;
try {
    app.listen(port || 3000, () => console.log(`listenning to port ${port}...`));
}
catch (err) {
    console.log("Unable to establish server");
    exit(1);
}
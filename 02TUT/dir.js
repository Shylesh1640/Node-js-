const fs = require('fs');

if(!fs.existsSync('./tutorial')){

fs.mkdir('./tutorial', (err) => {
    if (err) throw err;
    console.log('Directory created successfully');
});
} else {
    console.log('Directory already exists');
}
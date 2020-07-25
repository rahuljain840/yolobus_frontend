var fs = require('fs');
var contents = fs.readFileSync('./config/dev.config.js', 'utf8');

contents = contents.replace(/API_ENDPOINT/g, process.argv[2]);

fs.writeFileSync('./config/dev.config.js', contents, {'encoding': 'utf8'});

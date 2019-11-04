var fs = require('fs');

const themes = [];

const loadTheme = async (src) => {
    src = __dirname + '/../pages/' + src;
    return new Promise(function (resolve, reject) {
        fs.readFile(src, {'encoding': 'utf8'}, function (err, data) {
            if(err) return reject(err);
            resolve(data);
        });
    });
};

module.exports = async function(src) {
    if (themes[src] === undefined) {
        themes[src] = await loadTheme((src));
    }
    return themes[src];
};

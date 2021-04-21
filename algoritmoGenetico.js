const fs = require('fs');

module.exports = function () {
  this.gravarAlgoritmo = function (rotulo, gen, inc) {
    if (rotulo == 'i') {
      fs.appendFile('input.txt', "neuronio " + inc + "=> "+gen+"\n", function (err, file) {
        if(err) throw err;
      });
    }else if (rotulo == 'p') {
      fs.appendFile('peso.txt', "neuronio " + inc + "=> "+gen+"\n", function (err, file) {
        if(err) throw err;
      });
    }else if (rotulo == 'o') {
      fs.appendFile('output.txt', "neuronio " + inc + "=> "+gen+"\n", function (err, file) {
        if(err) throw err;
      });
    }
  }
}


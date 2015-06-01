/**
 * Created by snekrasov on 27.05.2015.
 */
var path = require('path'),
    archiver = require('archiver');
//Упаковываем файдяв архив
module.exports.pack = function (files, stream) {

    var archive = archiver('zip');
    stream.header("Content-Type", "application/zip");
    archive.pipe(stream);
    files.forEach(function (file) {
        archive.append(file.text, {name: file.name});
    });
    archive.finalize();
};
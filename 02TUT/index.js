const fsPromises = require('fs').promises;
const path = require('path');
// fs.readFile(path.join(__dirname,'files','starter.txt'),'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data.toString());
// });

const fileOps = async () => {
    try{
        const data = await fsPromises.readFile(path.join(__dirname,'files','starter.txt'),'utf8');
        console.log(data);
        await fsPromises.unlink(path.join(__dirname,'files','starter.txt'));
        await fsPromises.writeFile(path.join(__dirname,'files','newStarter.txt'), data);
        await fsPromises.appendFile(path.join(__dirname,'files','newStarter.txt'), '\n\nNice to meet you.');
        await fsPromises.rename(path.join(__dirname,'files','newStarter.txt'), path.join(__dirname,'files','renamedStarter.txt'));
        const newData = await fsPromises.readFile(path.join(__dirname,'files','renamedStarter.txt'),'utf8');
        console.log(newData);
    } catch (err) {
        console.error(err);
    }
}

console.log('Hello...')

process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})

fileOps();
// fs.writeFile(path.join(__dirname,'files','reply.txt'),'Nice to meet you.', err => {
//     if (err) throw err;
//     console.log('Write complete.');
// });

// fs.appendFile(path.join(__dirname,'files','reply.txt'),'\n\nYes it is.', err => {
//     if (err) throw err;
//     console.log('Append complete.');
// });
// fs.rename(path.join(__dirname,'files','reply.txt'), path.join(__dirname,'files','newReply.txt'), err => {
//     if (err) throw err;
//     console.log('Rename complete.');
// });
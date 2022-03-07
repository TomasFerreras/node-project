const fs = require('fs');
const http = require('http');
const URL = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////////////////
// FILES

//Blocking I/O, synchronous way
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textInput)

// const textOutput = `This is what we know about the avocado: ${textInput}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOutput)
// console.log('File written!')

//Non-blocking I/O, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.error("ERROR");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written 😄");
//       });
//     });
//   });
// });
// console.log("Will read file!");

////////////////////////////////////////////
// SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const dataObject = JSON.parse(data);

const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = URL.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });

    const cardsHTML = dataObject
      .map((el) => replaceTemplate(templateCard, el))
      .join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
    res.end(output);
    //PRODUCT
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    const product = dataObject[query.id];
    const output = replaceTemplate(templateProduct, product);

    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'content-type': 'application/json',
    });
    res.end(data);

    //NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '192.168.0.51', () => {
  console.log('Server has been started on port 8000!');
});

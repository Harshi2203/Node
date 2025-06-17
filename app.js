const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const PORT=3000;

function serverHtmlForm(res){
    fs.readFile('./public/index.html',(err,data) => {
        if (err){
            res.writeHead(500,  { 'Content-Type': 'text/plain' })
            res.end('Internal Server Error');
            return;
        }
        res.writeHead('200', { 'Content-Type': 'text/html' });
        res.end(data);
    });
    
}

function handleFormSubmission(req,res){
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end',() =>{
        const formData = querystring.parse(body);
        const {name,email,phone,gender,password,file1} = formData;
        const hobbies= formData['hobbies[]'];
        const hobbie = Array.isArray(hobbies)? hobbies.join(','):hobbies;
        
        console.log('Form Submitted!');
        console.log('Name : ${name}');
        console.log('Email : ${email}');
        console.log('Phone No. : ${phone}');
        console.log('Password : ${password}');
        console.log('Gender : ${gender}');
        console.log('Hobbies : ${hobbie}');
        console.log('Photo : ${file1}');

        const successHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Submission Success</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4ff; margin: 20px; text-align: center; }
                    .container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: inline-block; }
                    h1 { color: #28a745; }
                    p { margin-bottom: 10px; }
                    a { color: #007bff; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Form Submitted Successfully!</h1>
                    <p>Thank you for your submission.</p>
                    <p>Here's what we received:</p>
                    <p><strong>Name:</strong> ${name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${email || 'N/A'}</p>
                    <p><strong>Phone No:</strong> ${phone || 'N/A'}</p>
                    <p><strong>Gender:</strong> ${gender || 'N/A'}</p>
                    <p><strong>Hobbies:</strong> ${hobbie || 'N/A'}</p>
                    <p><strong>Password:</strong> ${password || 'N/A'}</p>
                    <p><strong>Image:</strong> ${file1 || 'N/A'}</p>
                    <p><a href="/">Go back to the form</a></p>
                </div>
            </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(successHtml);
    })
     

}

//create http server

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      serverHtmlForm(res);
       }
    else if(req.method === 'POST' && req.url === '/submit-form'){
        handleFormSubmission(req, res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});
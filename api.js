const { Client } = require('whatsapp-web.js');
//const client = new Client();
const fs = require('fs');
var express=require('express');
var app=express();
var cors = require('cors');
var tel_esperando = [];

app.use(cors());

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox'] }, session: sessionCfg });


app.get('/lc/', async (req, res) => {

    client.initialize();

    client.on('qr', (qr_img) => {
        // NOTE: This event will not be fired if a session is specified.
        console.log('QR RECEIVED', qr_img);
        res.set({
            'Access-Control-Allow-Origin':'*',

        })
        res.status(200).json({
            QR_image: qr_img
        })
    });

    console.log('FIIIIIN');
    res.send('Alta exitosa');

});


app.get('/send_message/:number/:mensaje', async (req, res) => {

    const number = req.param('number');
    const mensaje = req.param('mensaje');
    console.log('LD is ready!');
    console.log(number);
    console.log(mensaje);
  // Number where you want to send the message.
    //const number = "+5215530348620";
    // Your message.
    const text = mensaje;
    // Getting chatId from the number.
    // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
    const chatId = number.substring(1) + "@c.us";

    // Sending message.
    client.sendMessage(chatId, text);
    res.send('LS exitoso');

});

app.get('/iniciar_encuesta/:number/:mensaje', async (req, res) => {

    const number = req.param('number');
    const mensaje = 'Buen dia! XX Te escribimos para cumplir con la encuesta de la NOM35. Tu empresa YY nos ha encargdo esta tarea. Cualquier duda con RH. Contesta si es un buen momento o la hora en la que te necesitamos buscar nuevamente:';
    console.log('LD is ready!');
    console.log(number);
    console.log(mensaje);
  // Number where you want to send the message.
    //const number = "+5215530348620";
    // Your message.
    const text = mensaje;
    // Getting chatId from the number.
    // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
    const chatId = number.substring(1) + "@c.us";
    tel_esperando.push(chatId);

    // Sending message.
    client.sendMessage(chatId, text);
    res.send('LS exitoso');

});

app.listen(3000, function () {
    console.log('Basic NodeJS app listening on port 3000.');
});


client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});





client.on('ready', () => {
    console.log('Client is ready!');
  // Number where you want to send the message.
    const number = "+5215530348620";
    // Your message.
    const text = "Vamos a iniciar con las preguntas....";
    // Getting chatId from the number.
    // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
    const chatId = number.substring(1) + "@c.us";

    // Sending message.
    client.sendMessage(chatId, text);
});


client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

    if ( tel_esperando.includes (msg.from))  {
    // the value is in the array
        console.log('Inicio encuesta!!');
        console.log(tel_esperando);
        
        //FUNCION QUE LIMPIA TODOS LOS STRINGS

        if(msg.body == 'si'){
            msg.reply('😊😊😊😊');
        } 


        if(msg.body == 'no'){
            msg.reply('💩💩💩💩💩');
        } 
        


        text = 'Poner que contestar con pregunta previa';
        client.sendMessage(msg.from, text);


    }

    if(msg.from == '5215523412628@c.us'){
        console.log('Send kiss');

        msg.reply('👾');
        
        client.sendMessage(msg.from, '😚');
    }

    if(msg.from == '5219991009464@c.us'){
        console.log('Send kiss');

        msg.reply('👾🍻🍻🍻');
        
        client.sendMessage(msg.from, '🏖🏖🏖🏖');
    }

    if(msg.from == '5215530861994@c.us'){
        console.log('Send kiss');

        msg.reply('🍻🍻🍻');
        
        client.sendMessage(msg.from, '🏖🏖🏖🏖');
    }

    if (msg.body == '!ping') {
        msg.reply('pong');
    
    } else if (msg.body.startsWith('!sendto ')) {
        // Direct send a new message to specific id
        console.log('aaaa1');
        await ejecutar();
        

    } else if (msg.body.startsWith('!echo ')) {
        // Replies with the same message
        msg.reply(msg.body.slice(6));
    } else if (msg.body === '!chats') {
        const chats = await client.getChats();
        client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
    }  
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});


//client.initialize();
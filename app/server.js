import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import socketio from 'socket.io';
import http from 'http';
import * as Notes from './controllers/note_controller';

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/notes';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// initialize
const app = express();

const server = http.createServer(app);
const io = socketio(server);

// enable/disable cross origin resource sharing if necessary
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('static'));
// enables static assets from folder static
app.set('views', path.join(__dirname, '../app/views'));
// this just allows us to render ejs from the ../app/views directory

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
server.listen(port);

console.log(`listening on: ${port}`);

io.on('connection', (socket) => {
  // on first connection emit notes
  Notes.getNotes().then((result) => {
    socket.emit('notes', result);
  });

  // pushes notes to everybody
  const pushNotes = () => {
    Notes.getNotes().then((result) => {
      // broadcasts to all sockets including ourselves
      io.sockets.emit('notes', result);
    });
  };

  // / on deleteNote do what is needful
  socket.on('deleteNote', (id) => {
    // you can do it
    Notes.findByIdAndRemove(id).then(() => {
      pushNotes();
    });
  });


  // creates notes and
  socket.on('updateNote', (id, fields) => {
    Notes.updateNote(id, fields).then(() => {
      pushNotes();
    });
  });
});

import mongoose, { Schema } from 'mongoose';

// create a NoteSchema with a title field
const NoteSchema = new Schema({
  title: String,
  x: Number,
  y: Number,
  zIndex: Number,
  text: String,
}, {
  toJSON: {

  },
});

// create NoteModel class from schema
const NoteModel = mongoose.model('Note', NoteSchema);

export default NoteModel;

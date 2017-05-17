import Note from '../models/note_model';


export const getNotes = () => {
  return Note.find({}).then((notes) => {
    return notes.reduce((result, item) => {
      result[item.id] = item;
      return result;
    }, {});
  });
};

export const deleteNote = (id) => {
  // to quote Prof. Cormen: left as an exercise to the reader
  // remember to return the mongoose function you use rather than just delete
  return Note.findByIdAndRemove({ _id: id });
};

export const createNote = (fields) => {
  // you know the drill. create a new Note mongoose object
  // return .save()
  const n = new Note();
  n.title = fields.title;
  n.x = fields.x;
  n.y = fields.y;
  n.zIndex = fields.zIndex;
  n.text = fields.text;
  return n.save();
};

export const updateNote = (id, fields) => {
  return Note.findById(id)
  .then((note) => {
    // check out this classy way of updating only the fields necessary
    Object.keys(fields).forEach((k) => {
      note[k] = fields[k];
    });
    return note.save();
  });
};

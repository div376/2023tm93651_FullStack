import mongoose from 'mongoose';
import shortid from 'shortid';

const bookSchema = new mongoose.Schema({
  bookId: { type: String, default: shortid.generate, unique: true },
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  condition: { type: String, required: true },
  availabilityStatus: { type: String, required: true },
  bookUser: { type: mongoose.Types.ObjectId, ref: 'user' },
}, { timestamps: true });

const bookModel = mongoose.model('book', bookSchema);

export default bookModel;
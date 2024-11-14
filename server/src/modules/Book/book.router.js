import {Router} from 'express'
import userAuth from '../../middleware/auth.js';
import validation from '../../middleware/validation.js';
import { fileUpload } from '../../utils/fileUpload.js';
import * as bookController from './book.controller.js';
import * as bookValidation from './book.validation.js';



const router = Router();



router.post('/',userAuth,fileUpload('path'),validation(bookValidation.bookSchema),bookController.addBook)
router.get('/',userAuth,bookController.getAllBooks)
router.get('/search',userAuth,bookController.searchBooks)
router.get('/:id',userAuth,bookController.getBookById)
router.get('/searchBooks/:letters',userAuth,bookController.getAllBooksByName)
router.patch('/:bookId',userAuth, bookController.editBook)
router.delete('/:bookId',userAuth,bookController.deleteBook)




export default router;
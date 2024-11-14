import moment from "moment";
import bookModel from "../../../database/models/bookModel.js";
import userModel from "../../../database/models/userModel.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import mongoose from 'mongoose';

import shortid from 'shortid';

export const addBook = catchAsyncError(async (req, res, next) => {
    const { title, author, genre, condition, availabilityStatus } = req.body;

    try {
        const book = await bookModel.create({
            bookId: shortid.generate(), // Generate a unique bookId
            title,
            author,
            genre,
            condition,
            availabilityStatus,
            bookPhoto: req.file.filename,
            userId: req.bookUser
        });

        const userBook = await userModel.findByIdAndUpdate(
            req.userId,
            {
                $push: {
                    userBooks:

                    {
                        bookId: book.bookId,
                        title: book.title,
                        author: book.author,
                        genre: book.genre,
                        condition: book.condition,
                        availabilityStatus: book.availabilityStatus,
                    }
                }
            },
            { new: true }
        );

        res.status(200).json({ status: 200, message: "success", book });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error code
            return next(new AppError("Book with this title or ID already exists", 400));
        }
        next(new AppError("Failed to insert book", 400));
    }
});

export const getAllBooks = catchAsyncError(async (req, res, next) => {
    const books = await bookModel.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 200, message: "success", books })
})

export const getAllBooksByName = catchAsyncError(async (req, res, next) => {
    let { letters } = req.params
    const books = await bookModel.find({ name: { $regex: letters, $options: 'i' } }).sort({ createdAt: -1 }).exec();
    res.status(200).json({ status: 200, message: "success", books })
})

export const getBookById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const book = await bookModel.findById(id)
    res.status(200).json({ status: 200, message: "success", book })
})


export const searchBooks = catchAsyncError(async (req, res, next) => {
    const { title, author, genre, condition, availabilityStatus, page = 1, limit = 10 } = req.query;

    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' }; // case-insensitive
    if (author) query.author = { $regex: author, $options: 'i' };
    if (genre) query.genre = genre;
    if (condition) query.condition = condition;
    if (availabilityStatus !== undefined) query.availabilityStatus = availabilityStatus;

    const books = await bookModel.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalBooks = await bookModel.countDocuments(query);

    res.json({
        books,
        totalResults: totalBooks, // Add totalResults to the response
        totalPages: Math.ceil(totalBooks / limit),
        currentPage: parseInt(page)
    });
});


export const editBook = catchAsyncError(async (req, res, next) => {
    const { bookId } = req.params; // Get the book ID from URL parameters
    const { title, author, genre, condition, availabilityStatus } = req.body; // Get the updated data from the request body

    // Find the book and update its fields
    const book = await bookModel.findByIdAndUpdate(bookId, {
        title,
        author,
        genre,
        condition,
        availabilityStatus,
        bookPhoto: req.file ? req.file.filename : undefined,  // Update book photo if new photo is uploaded
    }, { new: true, runValidators: true }); // 'new: true' ensures that the updated document is returned

    if (!book) {
        return next(new AppError("Book not found", 404)); // Handle case where book isn't found
    }

    res.status(200).json({
        status: 200,
        message: "Book updated successfully",
        book
    });
});


export const deleteBook = catchAsyncError(async (req, res, next) => {
    const { bookId } = req.params;  // Get the book ID from the query parameter
    // Check if the bookId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return next(new AppError("Invalid book ID format", 400));  // Return error if the ID is invalid
    }
    // Find and delete the book by its ID
    const book = await bookModel.findByIdAndDelete(bookId);

    if (!book) {
        return next(new AppError("Book not found", 404));  // Handle case where book is not found
    }

    // Send response if the book is successfully deleted
    res.status(200).json({
        status: 200,
        message: "Book deleted successfully"
    });
});
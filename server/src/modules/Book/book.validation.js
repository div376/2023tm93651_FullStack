import Joi from "joi";



export const bookSchema = {
    body: Joi.object({
        title: Joi.string().min(3).max(50).required(),
        author: Joi.string().min(3).max(50).required(),
        genre: Joi.string().min(3).max(50).required(),
        condition: Joi.string().min(3).max(50).required(),
        availabilityStatus: Joi.string().min(3).max(50).required(),
    })
}


export const issueBookSchema = {
    body:Joi.object({
        bookId:Joi.string().hex().length(24).required(),
        issuedDurationInDays:Joi.number().min(0).max(30).required(),
    })
}

export const returnBookSchema = {
    body:Joi.object({
        bookId:Joi.string().hex().length(24).required(),
    })
}

export const searchBookSchema = {
    params:Joi.object({
        bookName:Joi.string().min(1).max(15).required(),
    })
}


//bookName


//bookId
//bookId,issuedDurationInDays
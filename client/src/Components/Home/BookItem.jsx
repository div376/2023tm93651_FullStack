import React from 'react';
import CornerRibbon from "react-corner-ribbon";
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from 'axios';

export default function BookItem(probs) {
    const { _id, title, genre, author, availabilityStatus, condition, isIssued, bookPhoto } = probs;
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('jwtToken'); // Assuming you store the token in localStorage
            const response = await axios.delete(`http://localhost:5000/book/${_id}`, {
                headers: {
                    token: localStorage.getItem('userToken')
                }
            });
            if (response.status === 200) {
                alert('Book deleted successfully');
                // Optionally, you can add a callback to refresh the book list
                if (probs.onDelete) {
                    probs.onDelete(_id);
                }
                navigate('/home'); // Redirect to home page
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete the book');
        }
    };

    return (
        <div className="col-lg-3 col-md-4 col-sm-6 my-3">
            <Link className='text-decoration-none text-black' to={`/book/${_id}`}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7 }}
                    className='book-item p-2 text-center bg-light bg-opacity-25 rounded-2 shadow-sm me-4 me-md-0 mouse-pointer position-relative'
                    style={{
                        height: '250px', // Reduced height for smaller box
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        width: '100%', // Ensure the card fits inside the column
                        maxWidth: '250px' // Limit the width of the card
                    }}
                >
                    {/* Book Image */}
                    <div className="position-relative mb-3" style={{ height: '100px', overflow: 'hidden' }}>
                        <img
                            src={`http://localhost:5000/4e5af2d3-c6be-441b-bcce-e5ef4072f080-55411076%20copy.jpg`} // Using the bookPhoto URL
                            alt={title}
                            className="w-100"
                            style={{
                                height: '100%', // Fill the image container
                                objectFit: 'contain', // Ensure image covers the space properly
                                borderRadius: '5px' // Optional: rounded corners for image
                            }}
                        />
                    </div>

                    {/* Ribbon for issued books */}
                    {isIssued ? (
                        <CornerRibbon position="top-right" fontColor="#f0f0f0" backgroundColor="#951111" style={{ "fontSize": "10px" }}>
                            ISSUED BOOK
                        </CornerRibbon>
                    ) : null}

                    {/* Content */}
                    <div className="book-info mb-3" style={{ flexGrow: 1 }}>
                        <h5 className='mb-0 mt-2' style={{ fontSize: '20px' }}>{title}</h5>
                        <p className='py-0 my-0 text-secondary fw-lighter fs-8' style={{ fontSize: '15px' }}>{author}</p>
                        {/* <p className='py-0 my-0 text-secondary fw-lighter fs-8' style={{ fontSize: '12px' }}>{availabilityStatus}</p>
                        <p className='py-0 my-0 text-secondary fw-lighter fs-8' style={{ fontSize: '12px' }}>{genre}</p>
                        <p className='py-0 my-0 text-secondary fw-lighter fs-8' style={{ fontSize: '12px' }}>{condition}</p> */}
                    </div>

                    {/* Delete button */}
                    <button onClick={handleDelete} className="btn btn-danger mt-2" style={{ fontSize: '12px', marginBottom: '5px' }}>Delete</button>
                </motion.div>
            </Link>
        </div>
    );
}

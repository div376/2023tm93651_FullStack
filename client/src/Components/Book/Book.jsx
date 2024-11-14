import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Book() {
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    genre: '',
    condition: '',
    availabilityStatus: ''
  });
  const [show, setShow] = useState(false);
  let allURLParams = useParams();

  // Function to fetch the book data
  async function getBookData() {
    let { data } = await axios.get(`http://localhost:5000/book/${allURLParams.id}`, {
      headers: {
        token: localStorage.getItem('userToken')
      },
    });
    setBookData(data.book);
  }

  // Function to handle editing the book details
  const editBook = async (e) => {
    e.preventDefault();  // Prevent default form submission

    try {
      // Create the object with updated data
      const updatedData = {
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        condition: bookData.condition,
        availabilityStatus: bookData.availabilityStatus
      };

      // Make the PATCH request to update the book data
      const { data } = await axios.patch(`http://localhost:5000/book/${bookData._id}`, updatedData, {
        headers: {
          token: localStorage.getItem('userToken'),
          'Content-Type': 'application/json'
        },
      });

      console.log(data);
      if (data?.message === "Book updated successfully") {
        getBookData();  // Refresh the book data after editing
        setShow(false); // Close the modal
        console.log('Modal should close now'); // Log to confirm
      } else {
        alert('Failed to update book details'); // Handle unexpected responses
      }
    } catch (error) {
      console.error('Error updating book:', error);
      alert('An error occurred while updating the book details'); // Provide user feedback on error
    }
  };

  // Fetch book data when the component is mounted
  useEffect(() => {
    getBookData();
  }, []);

  return (
    <>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        animation={true}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="py-3" onSubmit={editBook}>
            {/* Title Field */}
            <input
              className="form-control mb-3"
              name="title"
              value={bookData.title}
              onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
              placeholder="Enter Title"
            />
            {/* Author Field */}
            <input
              className="form-control mb-3"
              name="author"
              value={bookData.author}
              onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
              placeholder="Enter Author"
            />
            {/* Genre Field */}
            <select
              className="form-control mb-3"
              name="genre"
              value={bookData.genre}
              onChange={(e) => setBookData({ ...bookData, genre: e.target.value })}
            >
              <option value="">Select Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
              <option value="Biography">Biography</option>
            </select>
            {/* Condition Field */}
            <select
              className="form-control mb-3"
              name="condition"
              value={bookData.condition}
              onChange={(e) => setBookData({ ...bookData, condition: e.target.value })}
            >
              <option value="">Select Condition</option>
              <option value="Good">Good</option>
              <option value="Bad">Bad</option>
              <option value="Worse">Worse</option>
            </select>
            {/* Availability Status Field */}
            <select
              className="form-control mb-3"
              name="availabilityStatus"
              value={bookData.availabilityStatus}
              onChange={(e) => setBookData({ ...bookData, availabilityStatus: e.target.value })}
            >
              <option value="">Select Availability Status</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="danger" className='text-white' onClick={editBook}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="overflow-hidden">
        <div className="row">
          <div className="col-2">
            <div className="position-fixed col-lg-2">
              <Sidebar />
            </div>
          </div>

          <div className="col-10 px-lg-5 px-2 my-3">
            <div className="row">
              <div className="col-lg-4">
                <div className='p-5'>
                  <img 
                    className='w-100 rounded-2' 
                    src={`http://localhost:5000/4e5af2d3-c6be-441b-bcce-e5ef4072f080-55411076%20copy.jpg`} 
                    alt={bookData.title} 
                    style={{
                      height: 'auto', // Ensure the image's height adjusts properly based on the aspect ratio
                      maxHeight: '350px', // Optional: set a max height if needed
                      objectFit: 'contain' // Ensures the image fits inside the container without being cut off
                    }}
                  />
                  <h4 className='text-center p-3 pb-0 fw-bolder'>{bookData.title}</h4>
                  <p className='text-center text-secondary fw-light'>{bookData.author}</p>
                </div>
              </div>
              <div className="col-lg-8 my-1">
                <div className='p-lg-5 px-5'>
          
                  <p className='d-none d-lg-block'><span className='fw-bold'>Genre</span> : {bookData.genre}</p>
                  <p className='d-none d-lg-block'><span className='fw-bold'>Availability Status</span> : {bookData.availabilityStatus ? "Available" : "Not Available"}</p>
                  <p className='d-none d-lg-block'><span className='fw-bold'>Condition</span> : {bookData.condition}</p>
                  <button
                    variant="primary"
                    onClick={() => setShow(true)}
                    className='btn btn-danger w-100 mb-3'>
                    Edit Book Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

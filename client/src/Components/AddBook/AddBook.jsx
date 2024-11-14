import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Lottie from 'lottie-web';
import { motion } from 'framer-motion';

export default function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [condition, setCondition] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the mandatory fields are filled
    if (!title || !photo) {
      setError('Title and PDF are mandatory fields.');
      return;
    }

    setError(''); // Clear any previous error
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('genre', genre);
    formData.append('condition', condition);
    formData.append('availabilityStatus', availabilityStatus);
    formData.append('path', photo);

    try {
      const response = await axios.post('http://localhost:5000/book', formData, {
        headers: {
          token: localStorage.getItem('userToken')
        },
      });
      console.log(response);
      if (response.data?.message === "success") {
        setSuccess(true);
        setTitle('');
        setAuthor('');
        setGenre('');
        setCondition('');
        setAvailabilityStatus('');
        setPhoto(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imgContainer = useRef(null);

  useEffect(() => {
    const container = imgContainer.current;
    if (!container) return;

    const anim = Lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('./../../images/addBook.json'),
    });

    return () => {
      anim.destroy();
    };
  }, []);

  return (
    <>
      <div className='overflow-hidden'>
        <div className="row">
          <div className="col-2">
            <div className='position-fixed col-lg-2'>
              <Sidebar />
            </div>
          </div>

          <div className="col-md-10 d-flex justify-content-center align-items-center min-vh-100">
            <motion.div initial={{ y: -1000 }} animate={{ y: 0 }} transition={{ duration: 1.5, type: 'spring' }} className='p-5 w-75 text-center bg-white bg-opacity-25 my-2 shadow rounded-2'>
              <div className='w-25 mx-auto' ref={imgContainer}></div>
              <p className='fw-bold fs-5'>Enter Book Details Now ....</p>
              <form onSubmit={handleSubmit}>
                <input onChange={(e) => setPhoto(e.target.files[0])} type="file" className='form-control my-2' id='photo' name='path' placeholder='Choose Your PDF' />
                <input onChange={(e) => setTitle(e.target.value)} type="text" className='form-control my-2' id='title' name='title' placeholder='Enter Book Title' required />

                <input onChange={(e) => setAuthor(e.target.value)} type="text" className='form-control my-2' id='author' name='author' placeholder='Enter Book Author' />

                <select onChange={(e) => setGenre(e.target.value)} className='form-control my-2' id='genre' name='genre'>
                  <option value="">Select Genre</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Biography">Biography</option>
                </select>

                <select onChange={(e) => setCondition(e.target.value)} className='form-control my-2' id='condition' name='condition'>
                  <option value="">Select Condition</option>
                  <option value="Good">Good</option>
                  <option value="Bad">Bad</option>
                  <option value="Worse">Worse</option>
                </select>

                <select onChange={(e) => setAvailabilityStatus(e.target.value)} className='form-control my-2' id='availabilityStatus' name='availabilityStatus'>
                  <option value="">Select Availability</option>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>

                <button className='btn btn-danger w-100 rounded-2 text-light'>Add Book</button>
              </form>
              {error && <div className='my-3 alert alert-danger'>{error}</div>}
              {success && <div className='my-3 alert alert-success'>Book added successfully</div>}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

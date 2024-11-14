import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import Sidebar from "../Sidebar/Sidebar";
import BookItem from "./BookItem";
import { motion } from "framer-motion";

export default function Home() {
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [genres, setGenres] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [searchParams, setSearchParams] = useState({
    title: '',
    author: '',
    genre: '',
    condition: '',
    availabilityStatus: '',
    page: 1,
    limit: 10
  });
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const totalPages = Math.ceil(totalResults / searchParams.limit);

  async function searchBooks() {
    setLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([key, value]) => value)
      );

      const { data } = await axios.get('http://localhost:5000/book/search', {
        headers: {
          token: localStorage.getItem('userToken')
        },
        params: filteredParams
      });
      setAllBooks(data.books);
      setTotalResults(data.totalResults); // Assuming your API returns totalResults
    } catch (error) {
      setErr('Error fetching books');
    } finally {
      setLoading(false);
    }
  }

  async function deleteBook(bookId) {
    try {
      setLoading(true);
      let response = await axios.delete(`http://localhost:5000/book/${bookId}`, {
        headers: {
          token: localStorage.getItem('userToken')
        },
      });

      alert(response.data.message);
      setAllBooks(allBooks.filter(book => book._id !== bookId));
    } catch (err) {
      setErr('Error deleting book');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchBooks();
  }, [searchParams.page, searchParams.limit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks();
  };

  const handleCriteriaChange = (e) => {
    const value = e.target.value;
    setSelectedCriteria(prevState => (
      prevState.includes(value) ? prevState : [...prevState, value]
    ));
  };

  const removeCriterion = (criterion) => {
    setSelectedCriteria(prevState => prevState.filter(c => c !== criterion));
    setSearchParams(prevState => ({
      ...prevState,
      [criterion]: ''
    }));
  };

  const handleLimitChange = (e) => {
    setSearchParams(prevState => ({
      ...prevState,
      limit: e.target.value,
      page: 1
    }));
  };

  const handleNextPage = () => {
    setSearchParams(prevState => ({
      ...prevState,
      page: prevState.page + 1
    }));
  };

  const handlePreviousPage = () => {
    setSearchParams(prevState => ({
      ...prevState,
      page: prevState.page - 1
    }));
  };

  return (
    <>
      <div className="overflow-hidden">
        <div className="row">
          <div className="col-2">
            <div className="position-fixed col-lg-2">
              <Sidebar />
            </div>
          </div>

          <div className="col-10 px-lg-5 px-2 my-3">
            <motion.span
              initial={{ y: -150 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className='mx-auto pe-5 pe-lg-0 p d-flex align-items-center justify-content-center'
            >
              <form onSubmit={handleSearch} className="w-100">
                <select
                  onChange={handleCriteriaChange}
                  className='form-control d-inline my-4'
                  value=""
                >
                  <option value="">Select Search Criteria</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="genre">Genre</option>
                  <option value="condition">Condition</option>
                  <option value="availabilityStatus">Availability Status</option>
                </select>

                {selectedCriteria.map((criterion, index) => (
                  <div key={index} className="my-2">
                    {criterion === 'title' && (
                      <input
                        onChange={handleInputChange}
                        type="search"
                        className='form-control d-inline my-2'
                        placeholder='Enter Book Title ...'
                        name="title"
                        value={searchParams.title}
                      />
                    )}

                    {criterion === 'author' && (
                      <input
                        onChange={handleInputChange}
                        type="search"
                        className='form-control d-inline my-2'
                        placeholder='Enter Author ...'
                        name="author"
                        value={searchParams.author}
                      />
                    )}

                    {criterion === 'genre' && (
                      <select
                        onChange={handleInputChange}
                        className='form-control d-inline my-2'
                        name="genre"
                        value={searchParams.genre}
                      >
                        <option value="">Select Genre</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Science Fiction">Science Fiction</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Biography">Biography</option>
                      </select>
                    )}

                    {criterion === 'condition' && (
                      <select
                        onChange={handleInputChange}
                        className='form-control d-inline my-2'
                        name="condition"
                        value={searchParams.condition}
                      >
                        <option value="">Select Condition</option>
                        <option value="Good">Good</option>
                        <option value="Bad">Bad</option>
                        <option value="Worse">Worse</option>
                      </select>
                    )}

                    {criterion === 'availabilityStatus' && (
                      <select
                        onChange={handleInputChange}
                        className='form-control d-inline my-2'
                        name="availabilityStatus"
                        value={searchParams.availabilityStatus}
                      >
                        <option value="">Select Availability</option>
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                      </select>
                    )}

                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      onClick={() => removeCriterion(criterion)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="my-2">
                  <label htmlFor="limit" className="me-2">Results per page:</label>
                  <select
                    id="limit"
                    onChange={handleLimitChange}
                    className='form-control d-inline w-auto'
                    value={searchParams.limit}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>

                <button type="submit" className='btn btn-danger text-white d-inline-block ms-3 h-50'>
                  Search
                </button>
              </form>
            </motion.span>

            <div className="row">
              {loading ? (
                <Loading />
              ) : allBooks.length ? (
                allBooks.map((book, index) => (
                  <BookItem
                    key={index}
                    _id={book._id}
                    title={book.title}
                    author={book.author}
                    genre={book.genre}
                    condition={book.condition}
                    availabilityStatus={book.availabilityStatus}
                    bookPhoto={book.bookPhoto}
                    onDelete={deleteBook}
                  />
                ))
              ) : (
                <div>No books found</div>
              )}
            </div>
            {err && <div className="alert alert-danger">{err}</div>}

            <div className="my-2">
              {searchParams.page > 1 && (
                <button onClick={handlePreviousPage} className="btn btn-primary me-2">
                  Previous
                </button>
              )}
              {searchParams.page < totalPages && (
                <button onClick={handleNextPage} className="btn btn-primary">
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';

const movies = [
  { id: 1, title: 'Avengers: Endgame', price: 15.99, genre: 'Action' },
  { id: 2, title: 'Dune: Part Two', price: 18.99, genre: 'Sci-Fi' },
  { id: 3, title: 'The Batman', price: 16.99, genre: 'Action' },
  { id: 4, title: 'Spider-Man: No Way Home', price: 17.99, genre: 'Action' }
];

const Seat = ({ isSelected, isOccupied, onClick, seatNumber }) => {
  const getSeatClass = () => {
    if (isOccupied) return 'bg-gray-400 cursor-not-allowed';
    if (isSelected) return 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-400/50';
    return 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 cursor-pointer';
  };

  return (
    <div
      className={`w-8 h-8 rounded-t-lg transition-all duration-200 transform hover:scale-110 ${getSeatClass()}`}
      onClick={!isOccupied ? onClick : undefined}
    />
  );
};

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState(movies[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats] = useState([4, 5, 19, 20, 35, 36, 37]);

  const totalSeats = 48;
  const seatsPerRow = 8;

  useEffect(() => {
    const saved = localStorage.getItem('movieBooking');
    if (saved) {
      const { movieId, seats } = JSON.parse(saved);
      const movie = movies.find(m => m.id === movieId);
      if (movie) {
        setSelectedMovie(movie);
        setSelectedSeats(seats);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('movieBooking', JSON.stringify({
      movieId: selectedMovie.id,
      seats: selectedSeats
    }));
  }, [selectedMovie, selectedSeats]);

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats(prev => 
      prev.includes(seatNumber) 
        ? prev.filter(seat => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const totalPrice = selectedSeats.length * selectedMovie.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900">
      <div className="container mx-auto px-4 py-8 flex items-center flex-col">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">CinemaMax</h1>
          <p className="text-xl text-primary-200">Premium Movie Experience</p>
        </div>

        {/* Movie Selection */}
        <div className="w-max bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">Select Movie</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {movies.map(movie => (
              <div
                key={movie.id}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  selectedMovie.id === movie.id
                    ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/30'
                    : 'border-white/30 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => setSelectedMovie(movie)}
              >
                <h3 className="font-semibold text-white text-lg mb-2">{movie.title}</h3>
                <p className="text-primary-200 text-sm mb-2">{movie.genre}</p>
                <p className="text-yellow-400 font-bold text-xl">${movie.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-t-lg"></div>
                <span className="text-white">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-t-lg"></div>
                <span className="text-white">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-400 rounded-t-lg"></div>
                <span className="text-white">Occupied</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cinema Layout */}
        <div className="max-w-2xl mx-auto mb-8">
          {/* Screen */}
          <div className="mb-8">
            <div className="h-2 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mb-2 shadow-lg shadow-white/50"></div>
            <p className="text-center text-white/70 text-sm">SCREEN</p>
          </div>

          {/* Seats */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="grid gap-4">
              {Array.from({ length: totalSeats / seatsPerRow }, (_, rowIndex) => (
                <div key={rowIndex} className="flex justify-center space-x-2">
                  {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                    const seatNumber = rowIndex * seatsPerRow + seatIndex;
                    return (
                      <Seat
                        key={seatNumber}
                        seatNumber={seatNumber}
                        isSelected={selectedSeats.includes(seatNumber)}
                        isOccupied={occupiedSeats.includes(seatNumber)}
                        onClick={() => handleSeatClick(seatNumber)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-8 text-center shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Summary</h3>
            <div className="space-y-3 text-gray-900">
              <div className="flex justify-between items-center">
                <span className="font-medium">Movie:</span>
                <span className="font-semibold">{selectedMovie.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Seats:</span>
                <span className="font-semibold">{selectedSeats.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Price per seat:</span>
                <span className="font-semibold">${selectedMovie.price}</span>
              </div>
              <hr className="border-gray-700" />
              <div className="flex justify-between items-center text-xl">
                <span className="font-bold">Total:</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            {selectedSeats.length > 0 && (
              <button className="w-full mt-6 bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200">
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
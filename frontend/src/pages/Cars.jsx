import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { carsApi } from '../services/api';
import { mapCar } from '../services/carMapper';
import { matchCity, allCityValues } from '../data/cities';

const getDateOffset = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const Cars = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read the search information passed from the homepage.
  const urlCity = searchParams.get('city') || '';
  const urlCategory = searchParams.get('category') || 'all';
  const pickupDate = searchParams.get('pickupDate') || '';
  const pickupTime = searchParams.get('pickupTime') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const returnTime = searchParams.get('returnTime') || '';
  const urlMinPrice = searchParams.get('minPrice') || '';
  const urlMaxPrice = searchParams.get('maxPrice') || '';
  const urlSortBy = searchParams.get('sortBy') || 'recommended';

  // Featured vehicle links use ?car=vehicle-name.
  const featuredCar = searchParams.get('car') || searchParams.get('carName') || '';
  const featuredCarId = searchParams.get('carId') || '';

  // Local filter state.
  const [city, setCity] = useState(urlCity);
  const [category, setCategory] = useState(urlCategory.toLowerCase());
  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [sortBy, setSortBy] = useState(urlSortBy);

  // API data state
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Keep the filter state in sync if the URL changes.
  const [prevUrlCity, setPrevUrlCity] = useState(urlCity);
  const [prevUrlCat, setPrevUrlCat] = useState(urlCategory);
  const [prevUrlMin, setPrevUrlMin] = useState(urlMinPrice);
  const [prevUrlMax, setPrevUrlMax] = useState(urlMaxPrice);
  const [prevUrlSort, setPrevUrlSort] = useState(urlSortBy);

  if (
    prevUrlCity !== urlCity ||
    prevUrlCat !== urlCategory ||
    prevUrlMin !== urlMinPrice ||
    prevUrlMax !== urlMaxPrice ||
    prevUrlSort !== urlSortBy
  ) {
    setPrevUrlCity(urlCity);
    setPrevUrlCat(urlCategory);
    setPrevUrlMin(urlMinPrice);
    setPrevUrlMax(urlMaxPrice);
    setPrevUrlSort(urlSortBy);

    setCity(urlCity);
    setCategory(urlCategory.toLowerCase());
    setMinPrice(urlMinPrice);
    setMaxPrice(urlMaxPrice);
    setSortBy(urlSortBy);
  }

  // Build ISO dates for the API
  const pickupISO = pickupDate
    ? `${pickupDate}T${pickupTime || '10:00'}`
    : `${getDateOffset(1)}T10:00`;
  const returnISO = returnDate
    ? `${returnDate}T${returnTime || '18:00'}`
    : `${getDateOffset(2)}T18:00`;

  // Debounce ref
  const debounceRef = useRef(null);

  // Fetch cars from API
  const fetchCars = useCallback(async (cityText) => {
    setLoading(true);
    setError('');

    try {
      const matched = matchCity(cityText);

      let allCars = [];

      if (matched) {
        // Exact city match → one API call
        const data = await carsApi.checkAvailability({
          location: matched,
          pickupDate: pickupISO,
          returnDate: returnISO,
        });
        allCars = (data.availableCars || []).map(mapCar);
      } else if (!cityText || !cityText.trim()) {
        // Empty city → fetch all cities in parallel
        const cities = allCityValues();
        const results = await Promise.allSettled(
          cities.map((c) =>
            carsApi.checkAvailability({
              location: c,
              pickupDate: pickupISO,
              returnDate: returnISO,
            })
          )
        );
        for (const r of results) {
          if (r.status === 'fulfilled' && r.value.availableCars) {
            allCars.push(...r.value.availableCars.map(mapCar));
          }
        }
      }
      // else: non-empty text with no city match → allCars stays []

      setCars(allCars);
    } catch (err) {
      setError(err.message || 'Failed to load vehicles');
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [pickupISO, returnISO]);

  // Fetch on mount and when city/dates change (debounced for city typing)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchCars(city);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [city, pickupISO, returnISO, fetchCars]);

  // Client-side filters on the fetched + mapped data
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Vehicle category filter.
    if (category !== 'all' && category !== 'instant') {
      result = result.filter(
        (car) => car.category?.toLowerCase() === category
      );
    }

    // Price filters.
    if (minPrice !== '') {
      result = result.filter((car) => car.price >= Number(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter((car) => car.price <= Number(maxPrice));
    }

    // Featured car selection.
    if (featuredCarId) {
      result = result.filter((car) => car.id === featuredCarId);
    } else if (featuredCar) {
      result = result.filter((car) =>
        car.name.toLowerCase().includes(featuredCar.toLowerCase())
      );
    }

    // Sorting.
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [cars, category, minPrice, maxPrice, sortBy, featuredCar, featuredCarId]);

  const clearFilters = () => {
    setCity('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('recommended');

    setSearchParams((params) => {
      ['city', 'category', 'delivery', 'car', 'carName', 'carId'].forEach(
        (key) => params.delete(key)
      );
      return params;
    });
  };

  const hasActiveFilters =
    city.trim() !== '' ||
    category !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    featuredCar !== '' ||
    featuredCarId !== '';

  // Navigate to details with car data in state + sessionStorage
  const handleCardNav = (car) => {
    try {
      sessionStorage.setItem(`rydely-car-${car.id}`, JSON.stringify(car));
    } catch { /* ignore quota errors */ }
    navigate(`/cars/${encodeURIComponent(car.id)}${window.location.search}`, {
      state: { car },
    });
  };

  return (
    <div className="min-h-screen bg-[#070404] text-white font-['Outfit'] pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-400 bg-red-950/60 border border-red-500/30 px-3.5 py-1 rounded-full">
            VEHICLE FLEET · FIND & RENT
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white mt-4 mb-3 tracking-tight">
            Find Your Perfect Drive
          </h1>

          <p className="text-sm sm:text-base text-slate-400">
            Explore verified self-drive cars and find the right ride for your journey.
          </p>
        </div>

        {/* Search and filter panel */}
        <section className="mb-10 p-5 sm:p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">

            {/* City search */}
            <div className="flex-1">
              <label htmlFor="city-search" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Pickup city
              </label>
              <input
                id="city-search"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Try Mumbai, Delhi NCR..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-red-500"
              />
            </div>

            {/* Category */}
            <div className="flex-1">
              <label htmlFor="category-filter" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Vehicle type
              </label>
              <select
                id="category-filter"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500"
              >
                <option value="all">All vehicles</option>
                <option value="suv">SUV</option>
                <option value="mpv">MPV</option>
                <option value="4x4">4x4</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex-1">
              <label htmlFor="sort-filter" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Sort by
              </label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
              </select>
            </div>
          </div>

          {/* Price filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-zinc-800">

            <div>
              <label htmlFor="min-price" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Minimum price (₹/day)
              </label>
              <input
                id="min-price"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="No minimum"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="max-price" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Maximum price (₹/day)
              </label>
              <input
                id="max-price"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="No maximum"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="text-sm font-semibold text-red-400 hover:text-red-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </section>

        {/* Search dates received from homepage */}
        {(pickupDate || returnDate || featuredCar) && (
          <div className="mb-8 p-4 rounded-2xl bg-red-950/20 border border-red-500/20 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            {featuredCar && (
              <span>
                Selected car: <strong className="text-white">{featuredCar}</strong>
              </span>
            )}

            {pickupDate && (
              <span>
                Pickup: <strong className="text-white">{pickupDate} {pickupTime}</strong>
              </span>
            )}

            {returnDate && (
              <span>
                Return: <strong className="text-white">{returnDate} {returnTime}</strong>
              </span>
            )}
          </div>
        )}

        {/* Results heading */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Available vehicles
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {loading
                ? 'Searching...'
                : `${filteredCars.length} ${filteredCars.length === 1 ? 'vehicle' : 'vehicles'} found`}
            </p>
          </div>

          <Link
            to="/"
            className="text-sm text-red-400 hover:text-red-300 font-semibold"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Car results */}
        {loading ? (
          <div className="text-center py-16 px-5 rounded-3xl bg-zinc-950/70 border border-zinc-800">
            <div className="text-4xl mb-4 animate-pulse">🚘</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Loading vehicles...
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Checking availability across cities. This may take a moment.
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-5 rounded-3xl bg-zinc-950/70 border border-red-500/20">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-red-300 max-w-md mx-auto mb-6">{error}</p>
            <button
              type="button"
              onClick={() => fetchCars(city)}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                {...car}
                onBookNow={() => handleCardNav(car)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-5 rounded-3xl bg-zinc-950/70 border border-zinc-800">
            <div className="text-4xl mb-4">🚘</div>
            <h3 className="text-xl font-bold text-white mb-2">
              No cars found
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Try changing your city, vehicle type or price range to see more available cars.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;

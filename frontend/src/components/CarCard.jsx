const CarCard = ({ name = 'Vehicle', price = '₹2,999' }) => {
  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white">
      <h3 className="font-bold">{name}</h3>
      <p className="text-red-400">{price}/day</p>
    </div>
  );
};

export default CarCard;

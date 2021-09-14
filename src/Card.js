const Card = ({ value, isSelected, handleSelect }) => {
  return (
    <div
      className={`card${isSelected ? " selected" : ""}`}
      onClick={() => handleSelect(value)}
    >
      <img
        src={`/images/${isSelected ? "BLUE_BACK" : value}.svg`}
        alt={value}
      />
    </div>
  );
};

export default Card;

import PropTypes from "prop-types";

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      className="input w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

SearchInput.defaultProps = {
  placeholder: "Search...",
};

export default SearchInput;

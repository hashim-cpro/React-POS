import PropTypes from "prop-types";

const ImagePreview = ({ url }) => {
  return (
    <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
      {url ? (
        <img
          src={url}
          alt="Profile preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <svg
            className="w-20 h-20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

ImagePreview.propTypes = {
  url: PropTypes.string,
};

export default ImagePreview;

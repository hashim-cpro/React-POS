import PropTypes from "prop-types";
import profilePlaceholder from "../../assets/ProfilePlaceholder.svg";

const ProfilePicture = ({ url, size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-[70px] w-[70px]",
    large: "h-16 w-16",
  };

  const baseClasses = "rounded-full object-cover]";
  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;

  if (url === "") {
    return <img src={profilePlaceholder} className={finalClasses} />;
  } else {
    return (
      <img
        src={url}
        alt="Profile"
        className={finalClasses}
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>";
        }}
      />
    );
  }
};

ProfilePicture.propTypes = {
  url: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
};

export default ProfilePicture;

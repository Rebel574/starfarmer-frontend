import React from 'react';
import { Link } from 'react-router-dom';

interface BannerProps {
  message: string;
  linkText: string;
  linkTo: string;
}

const Banner: React.FC<BannerProps> = ({ message, linkText, linkTo }) => {
  return (
    <div className="bg-green-100 border-b border-green-200 py-2 text-center text-green-700 text-sm">
      {message} <Link to={linkTo} className="font-semibold hover:underline">{linkText}</Link>
    </div>
  );
};

export default Banner;
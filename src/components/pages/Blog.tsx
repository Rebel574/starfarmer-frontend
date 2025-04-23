import React,{useEffect} from 'react';
import { BookOpenIcon } from 'lucide-react'; // Optional: lucide-react for icons

const Blog: React.FC = () => {

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10 z-0"
          style={{ backgroundImage: "url('https://res.cloudinary.com/dxjgp7tyl/image/upload/v1745382823/Logo_opcdzi.png')" }}
        />
        <div className="relative z-20 text-center px-6">
          <BookOpenIcon className="w-16 h-16 text-blue-600 mb-4 mx-auto" />
          <h1 className="text-4xl font-bold text-blue-700 mb-3">Blog</h1>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            Currently, no blogs are available. Stay tuned for upcoming posts and insights from our team.
          </p>
        </div>
      </div>
    );
};

export default Blog;

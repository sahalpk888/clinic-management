const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="text-xl mt-3">Page Not Available</p>

      <p className="text-gray-500 mt-2">
        The page you are looking for doesn't exist.
      </p>
    </div>
  );
};

export default PageNotFound;
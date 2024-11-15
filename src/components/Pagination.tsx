interface PaginationProps {
    onPrevious: () => void;
    onNext: () => void;
    currentPage: number;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ onPrevious, onNext, currentPage }) => {
    return (
      <div className="m-12 flex justify-between w-full">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="rounded-md bg-quan text-white p-2 text-sm w-24 cursor-pointer disabled:cursor-not-allowed disabled:bg-pink-200"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="rounded-md bg-quan text-white p-2 text-sm w-24 cursor-pointer disabled:cursor-not-allowed disabled:bg-pink-200"
        >
          Next
        </button>
      </div>
    );
  };
  
  export default Pagination;
  
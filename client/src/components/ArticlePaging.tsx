import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface IPagination {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ArticlePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: IPagination) => {
  const handleClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={`mx-1 my-1 rounded-md px-3 py-1 ${
            i === currentPage
              ? " bg-green-500 text-black dark:bg-green-300 dark:bg-opacity-30 dark:text-light-light "
              : "bg-gray-200 text-gray-700 hover:bg-green-300 dark:bg-dark-dark dark:text-light-light dark:hover:bg-stone-600"
          }`}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className="mt-6 flex items-center justify-center">
      <button
        className={`mx-1 rounded-md border border-gray-300  px-3 py-1 dark:border-opacity-10 dark:bg-dark-dark dark:hover:bg-stone-600 ${
          currentPage === 1
            ? " cursor-text bg-green-200 hover:bg-green-200 dark:border-opacity-10 dark:bg-opacity-10 dark:hover:bg-dark-darker"
            : "bg-green-400 hover:bg-gray-100"
        }`}
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaAngleLeft />
      </button>
      {renderPageNumbers()}
      <button
        className={`mx-1 rounded-md border border-gray-300  px-3 py-1 dark:border-opacity-10 dark:bg-dark-dark dark:hover:bg-stone-600 ${
          currentPage === totalPages
            ? " cursor-text bg-green-200 hover:bg-dark-dark dark:border-opacity-10 dark:bg-opacity-10 dark:hover:bg-dark-darker"
            : "bg-green-400 hover:bg-green-300"
        }`}
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default ArticlePagination;

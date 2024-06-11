import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function BookList({ books = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - (window.innerWidth < 640 ? 2 : 4));
    }
  };

  const handleNext = () => {
    if (window.innerWidth < 640) {
      if (currentIndex < books.length - 2) {
        setCurrentIndex(currentIndex + 2);
      }
    } else {
      if (currentIndex < books.length - 4) {
        setCurrentIndex(currentIndex + 4);
      }
    }
  };

  const displayedBooks =
    window.innerWidth < 640
      ? books.slice(currentIndex, currentIndex + 2)
      : books.slice(currentIndex, currentIndex + 4);

  return (
    <div className="relative flex w-full items-center">
      <FaArrowLeft
        onClick={handlePrev}
        className={`absolute -left-4  top-1/2 z-20 size-8 -translate-y-1/2 transform cursor-pointer rounded-full bg-light-light p-2 dark:bg-dark-dark dark:text-light-light dark:text-opacity-80 ${currentIndex === 0 ? "cursor-not-allowed opacity-50" : ""}`}
      />
      <div className="relative w-full overflow-hidden">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            className=" grid w-full grid-cols-2 gap-4 sm:grid-cols-4"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {displayedBooks.map((book: IBook) => (
              <Link key={book._id} href={`/books/${book._id}`} shallow={true}>
                <motion.div
                  key={book._id}
                  className=" flex w-full cursor-pointer flex-col items-center rounded-lg border-2 border-solid border-gray-300 p-5 dark:border-opacity-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  layoutId={book._id}
                >
                  <div className="relative mb-3 h-60 w-40">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="absolute left-0 top-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="h-20 w-full rounded-lg bg-light-lighter p-2 dark:bg-dark-dark">
                    <span>{book.review[0]?.content}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <FaArrowRight
        onClick={handleNext}
        className={`absolute -right-4 top-1/2 z-20 size-8 -translate-y-1/2 transform cursor-pointer rounded-full bg-light-light p-2 dark:bg-dark-dark dark:text-light-light dark:text-opacity-80 ${currentIndex === (window.innerWidth < 640 ? books.length - 2 : books.length - 4) ? "cursor-not-allowed opacity-50" : ""}`}
      />
    </div>
  );
}

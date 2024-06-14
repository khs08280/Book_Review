import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface BookListProps {
  books: IBook[];
}

export default function BookList({ books }: BookListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [back, setBack] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 640 ? 2 : 4);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const handlePrev = () => {
    setBack(true);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - (window.innerWidth < 640 ? 2 : 4));
    }
  };

  const handleNext = () => {
    setBack(false);

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

  const slideVariants = {
    entry: (back: boolean) => ({
      x: back ? -900 : 900,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7 },
    },
    exit: (back: boolean) => ({
      x: back ? 900 : -900,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.7 },
    }),
  };
  const displayedBooks =
    window.innerWidth < 640
      ? books.slice(currentIndex, currentIndex + 2)
      : books.slice(currentIndex, currentIndex + 4);

  return (
    <div className="relative flex w-full  items-center">
      {currentIndex <
        (window.innerWidth < 640 ? books.length - 2 : books.length - 4) && (
        <FaArrowLeft
          onClick={handlePrev}
          aria-label="이전"
          className={`absolute left-0 top-44 z-10 size-8 -translate-y-1/2 transform cursor-pointer rounded-full bg-light-light p-2 dark:bg-dark-dark dark:text-light-light dark:text-opacity-80`}
        />
      )}
      <div className="relative w-full">
        <AnimatePresence initial={false} custom={back}>
          <motion.div
            key={currentIndex}
            custom={back}
            variants={slideVariants}
            className="absolute grid w-full grid-cols-2 gap-4 sm:grid-cols-4"
            initial="entry"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            {displayedBooks.map((book: IBook) => (
              <Link key={book._id} href={`/books/${book._id}`} shallow={true}>
                <motion.div
                  key={book._id}
                  className=" flex w-full cursor-pointer flex-col items-center rounded-lg border-2 border-solid border-green-400 border-opacity-40 bg-green-200 p-5 dark:border-opacity-10 dark:bg-dark-darker"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="relative mb-3 h-48 w-32">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="absolute left-0 top-0"
                    />
                  </div>
                  <div className="h-20 w-full rounded-lg bg-green-300 p-2  dark:bg-dark-dark">
                    <span>{book.review[0]?.content}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      {currentIndex <
        (window.innerWidth < 640 ? books.length - 2 : books.length - 4) && (
        <FaArrowRight
          onClick={handleNext}
          aria-label="다음"
          className={`absolute right-0 top-44 z-10 size-8 -translate-y-1/2 transform cursor-pointer rounded-full bg-light-light p-2 dark:bg-dark-dark dark:text-light-light dark:text-opacity-80`}
        />
      )}
    </div>
  );
}

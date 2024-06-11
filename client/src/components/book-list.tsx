import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

export function BookList({ books = [] }: IBookList) {
  return (
    <div className=" relative grid  w-full grid-cols-4 gap-4">
      <FaArrowLeft className=" absolute -left-4 top-1/2 size-8 -translate-y-1/2 transform cursor-pointer rounded-full  bg-light-light p-2 dark:bg-dark-dark dark:text-light-light dark:text-opacity-80" />
      {books.slice(0, 4).map((book) => (
        <Link key={book._id} href={`/books/${book._id}`} shallow={true}>
          <motion.div
            key={book._id}
            className="h-120 flex w-full cursor-pointer flex-col items-center rounded-lg border-2 border-solid border-gray-300 p-5 dark:border-opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            layoutId={book._id}
          >
            <img src={book.image} alt={book.title} className="mb-3 h-60 w-40" />
            <div className="h-20 w-full rounded-lg bg-light-lighter p-2 dark:bg-dark-dark">
              <span>{book.review[0]?.content}</span>
            </div>
          </motion.div>
        </Link>
      ))}
      <FaArrowRight className="absolute -right-4 top-1/2 size-8 -translate-y-1/2 transform cursor-pointer  rounded-full bg-light-light p-2   dark:bg-dark-dark dark:text-light-light dark:text-opacity-80" />
    </div>
  );
}

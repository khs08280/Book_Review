import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

export function BookList({ books = [], onBookClick }: IBookList) {
  const router = useRouter();
  const dfdf = usePathname();

  return (
    <div className=" w-full grid grid-cols-4 gap-4 relative">
      <FaArrowLeft className=" size-8 p-2 rounded-full cursor-pointer bg-light-light absolute top-1/2 -left-4  transform -translate-y-1/2" />
      {books.slice(0, 4).map((book) => (
        <Link href={`/books/${book._id}`}>
          <motion.div
            key={book._id}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full h-120 flex flex-col items-center border-solid border-2 border-gray-300 p-5 rounded-lg cursor-pointer"
            layoutId={book._id.toString()}
          >
            <img src={book.image} alt={book.title} className="w-40 h-60 mb-3" />
            <div className="w-full rounded-lg h-20 bg-light-lighter p-2">
              <span>{book.review[0]?.content}</span>
            </div>
          </motion.div>
        </Link>
      ))}
      <FaArrowRight className="size-8 p-2 rounded-full cursor-pointer bg-light-light  -right-4 absolute top-1/2   transform -translate-y-1/2" />
    </div>
  );
}

import Link from "next/link";

interface BookListProps {
  books: IBook[];
}

export function AllBookList({ books }: BookListProps) {
  return (
    <div className="flex w-full items-center">
      <div className="w-full">
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 lg:gap-4">
          {books.map((book: IBook) => (
            <Link key={book._id} href={`/books/${book._id}`} shallow={true}>
              <div className="flex w-full cursor-pointer flex-col items-center rounded-lg border-2 border-solid border-green-400 border-opacity-40 bg-green-200 p-2 dark:border-opacity-10 dark:bg-dark-darker lg:p-5">
                <div className="mb-3 h-48 w-32">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="left-0 top-0 h-full w-full object-cover"
                  />
                </div>
                <div className="h-20 w-full  rounded-lg p-2  text-center text-xl">
                  <span className="line-clamp-2">{book.title}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

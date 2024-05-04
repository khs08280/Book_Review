interface IReview {
  user: string;
  content: string;
}

interface IBook {
  _id: number;
  title: string;
  description: string;
  image: string;
  writer: string;
  rating: number;
  publisher: string;
  pubDate: string;
  price: number;
  genre: string[];
  review: IReview[];
}
interface IBookList {
  books?: IBook[];
}

export function BookList({ books = [] }: IBookList) {
  return (
    <div className=" w-full grid grid-cols-4 gap-4">
      {books.slice(0, 4).map((book) => (
        <div
          key={book._id}
          className=" w-full h-120 flex flex-col items-center border-solid border-2 border-gray-300 p-5  rounded-lg"
        >
          <img src={book.image} alt={book.title} className="w-40 h-60 mb-3" />
          <div className="w-full rounded-lg h-20 bg-light-lighter p-2">
            <span>{book.review[0]?.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

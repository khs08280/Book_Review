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
  onBookClick: (book: IBook) => void;
}

interface IBookModal {
  selectedBook?: IBook | null;
  onClose: () => void;
}

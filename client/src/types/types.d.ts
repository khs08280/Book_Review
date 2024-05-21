interface IReview {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    nickname: string;
  };
  book: string;
  likes: string[];
  dislikes: number;
  isRecommended: boolean;
  modifiedAt?: string;
  rating: number;
  createdAt: string;
  __v: number;
}

interface IBook {
  _id: string;
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
  books: IBook[];
}

interface IBookModal {
  selectedBook?: IBook | null;
  onClose: () => void;
}
interface StarsProps {
  myRating: number | null;
  handleRating: (rating: number) => void;
}
interface AverageStarsProps {
  averageRating: number | null;
  ratingCount?: number;
}

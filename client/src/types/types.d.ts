interface IReview {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    nickname: string;
  };
  book: {
    _id: string;
    title: string;
  };
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
  titleNoSpaces: string;
  genre: string[];
  review: IReview[];
}
interface ISearchedBook {
  _id: string;
  title: string;
  image: string;
  titleNoSpaces: string;
  writer: string;
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

interface IArticle {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    nickname: string;
    username: string;
  };
  modifiedAt: null | string;
  comments: [];
  createdAt: string;
  tags: string[];
  view: number;
  likes: string[];
  category: string;
}

interface IComment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    nickname: string;
  };
  article: {
    title: string;
    _id: string;
  };
  parentComment: string;
  likes: string[];
  children: [];
  modifiedAt: null | string;
  createdAt: string;
}
interface IReComment {
  _id: string;
  createdAt: string;
  content: string;
  modifiedAt: null | string;

  author: {
    _id: string;
    username: string;
    nickname: string;
  };
  likes: string[];
  children: string[];
}

interface IOneLine {
  _id: string;
  content: string;
  book?: {
    title: string;
    _id: string;
    image: string;
  };
  author: {
    _id: string;
    username: string;
    nickname: string;
  };
  modifiedAt: null | string;
  createdAt: string;
}
interface IActivityLog {
  _id: string;
  description: string;
  author: {
    _id: string;
    username: string;
    nickname: string;
  };
  isDelete: boolean;
  createdAt: string;
  referenceId: string;
  type: string;
  metadata: {
    content: string;
    title?: string;
    likes: string[];
  };
}

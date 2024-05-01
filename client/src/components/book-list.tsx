interface IReview {
  user: string;
  content: string;
}

interface Ibooks {
  id: number;
  name: string;
  description: string;
  image: string;
  writer: string;
  review: IReview[];
}

const books: Ibooks[] = [
  {
    id: 1,
    name: "돈의 속성",
    description: "book1 description",
    image:
      "https://image.aladin.co.kr/product/24370/18/cover500/e372537010_1.jpg",
    writer: "book1 writer",
    review: [
      {
        user: "asdf1234",
        content: "최고예용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ",
      },
    ],
  },
  {
    id: 2,
    name: "돈의 속성",
    description: "book2 description",
    image:
      "https://image.aladin.co.kr/product/24370/18/cover500/e372537010_1.jpg",
    writer: "book2 writer",
    review: [
      {
        user: "asdf1234",
        content: "최고예용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ",
      },
    ],
  },
  {
    id: 3,
    name: "돈의 속성",
    description: "book3 description",
    image:
      "https://image.aladin.co.kr/product/24370/18/cover500/e372537010_1.jpg",
    writer: "book3 writer",
    review: [
      {
        user: "asdf1234",
        content: "최고예용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ",
      },
    ],
  },
  {
    id: 4,
    name: "돈의 속성",
    description: "book4 description",
    image:
      "https://image.aladin.co.kr/product/24370/18/cover500/e372537010_1.jpg",
    writer: "book4 writer",
    review: [
      {
        user: "asdf1234",
        content: "최고예용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ",
      },
    ],
  },
];

export function BookList() {
  return (
    <div className=" w-full grid grid-cols-4 gap-4">
      {books.map((book) => (
        <div
          key={book.id}
          className=" w-full h-120 flex flex-col items-center border-solid border-2 border-gray-300 p-5  rounded-lg"
        >
          <img src={book.image} alt={book.name} className="w-40 h-60 mb-3" />
          <div className="w-full rounded-lg h-20 bg-light-lighter p-2">
            <span>{book.review[0].content}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

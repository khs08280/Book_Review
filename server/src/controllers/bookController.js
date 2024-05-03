import Book from "../models/book.js";

export const bookList = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};
export const hotBooks = (req, res) => {};
export const newBooks = (req, res) => {};
export const webFictions = (req, res) => {};

export const createBook = async (req, res, next) => {
  const {
    title,
    writer,
    image,
    publisher,
    pubDate,
    price,
    genre,
    description,
  } = req.body;
  const newBook = await Book.create({
    title,
    writer,
    image,
    publisher,
    pubDate,
    price,
    genre,
    description,
  });
  try {
    await newBook.save();
    console.log("Created", newBook);
    res.status(201).json({
      message: "Book created successfully",
      book: newBook,
    });
  } catch (e) {
    console.error("Error creating book", e);
    res.status(500).json({
      error: "Failed to create book",
    });
  }
};

// async function scrapeWebPage(url) {
//   try {
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);
//     // 원하는 정보가 있는 CSS 선택자를 사용하여 요소를 선택합니다.
//     const title = $("h2").text(); // 예시: 웹페이지의 제목을 가져옵니다.
//     console.log(title);
//     return title;
//   } catch (error) {
//     console.error("Error fetching web page:", error);
//   }
// }

// export async function saveScrapedData() {
//   const url =
//     "https://search.shopping.naver.com/book/catalog/32455965639?query=%EC%A7%80%EC%A0%81%EB%8C%80%ED%99%94%EB%A5%BC&NaPm=ct%3Dlvoz6hmo%7Cci%3Db5d5e62fd6557cc60e6e162bcb256d4d41a1a102%7Ctr%3Dboksl%7Csn%3D95694%7Chk%3D267a6513cfbcce8da3681ec17de8eadff8fbd7b0"; // 스크래핑할 웹페이지의 URL
//   const title = await scrapeWebPage(url);
//   // 스크래핑한 제목을 Book 모델에 저장합니다.
//   // const book = new Book({
//   //   title: title,
//   // });
//   // await book.save(); // 스크래핑한 제목을 데이터베이스에 저장합니다.
// }

export default function CommunitySearchForm({
  searchText,
  setSearchText,
  handleArticleSearch,
}: any) {
  return (
    <form
      onSubmit={handleArticleSearch}
      className="flex  w-full justify-center"
    >
      <input
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
        className=" mr-2 w-2/3 rounded-md p-2 focus:outline-none dark:bg-dark-dark"
        placeholder="검색어를 입력해주세요"
      />
      <button
        type="submit"
        className="rounded-md p-2 focus:outline-none dark:bg-dark-dark"
      >
        검색
      </button>
    </form>
  );
}

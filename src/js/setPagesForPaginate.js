const setPagesForPaginate = (currentPage, lastPage) => {
  if(lastPage <= 10 || currentPage < 10){
      return Array(lastPage > 10 ? 10 : lastPage).fill().map((e, i) => i + 1);
  }
  if(currentPage == lastPage){
    return Array(10).fill().map((e, i) => currentPage - i).reverse();
  }
  return Array(10).fill().map((e, i) => i + currentPage - 9 + 1);
}
export default setPagesForPaginate;
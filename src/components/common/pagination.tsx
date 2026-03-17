interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  return <div>Page {currentPage} of {totalPages}</div>;
};
export default Pagination;

import { HiSortAscending, HiSortDescending } from "react-icons/hi";

function SortOrderButton({ sortOrder, handleToggleSortOrder }) {
  return (
    <button
      onClick={handleToggleSortOrder}
      className="btn-sort-order"
    >
      {sortOrder === "asc" ? (
        <HiSortAscending className="text-base" />
      ) : (
        <HiSortDescending className="text-base" />
      )}
      <span>{sortOrder === "asc" ? "Asc" : "Desc"}</span>
    </button>
  );
}

export default SortOrderButton;


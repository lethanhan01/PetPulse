import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { paginate, PAGE_SIZE } from "@/utils/pagination";

export function usePagination<T>(items: T[], pageSize = PAGE_SIZE) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const result = paginate(items, Number.isFinite(requestedPage) ? requestedPage : 1, pageSize);
  useEffect(() => {
    if (requestedPage !== result.currentPage) {
      const next = new URLSearchParams(searchParams);
      next.set("page", String(result.currentPage));
      setSearchParams(next, { replace: true });
    }
  }, [requestedPage, result.currentPage, searchParams, setSearchParams]);
  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(Math.min(Math.max(1, page), result.totalPages)));
    setSearchParams(next);
  };
  return { ...result, setPage };
}

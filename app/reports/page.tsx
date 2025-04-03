"use client";

import { useDisclosure } from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { Key } from "@react-types/shared";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";

import { DetailDrawer } from "./detail-drawer";
import { FilterModal } from "./filter-modal";
import { TopContent } from "./top-content";

import { columns, swrConfig } from "@/app/reports/config";
import { appendParam, fetchReports } from "@/app/reports/handlers";
import { ReportCell } from "@/app/reports/report-cell";
import Error from "@/components/error";
import { Layout } from "@/components/layout";
import { Modal } from "@/components/modal";
import { Table } from "@/components/table";
import { Report } from "@/types/report.types";
import { calculateReportRow } from "@/utils/screen";

function SuspensedReportsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ReportsPage />
    </Suspense>
  );
}

function ReportsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const searchQuery = searchParams.get("q");
  const tab = searchParams.get("status") || "PENDING";
  const category = searchParams.get("category") || "";
  const priority = searchParams.get("priority") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const pic = searchParams.get("pic") || "";
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sortBy") || "newest";
  const queryParams = {
    q: searchQuery || "",
    status: tab as "PENDING" | "IN_PROGRESS" | "COMPLETED",
    page: page.toString(),
    category,
    priority,
    pic,
    startDate,
    endDate,
    sortBy,
  };
  const t = useTranslations("ReportsPage");
  const layoutRef = useRef<HTMLDivElement>(null);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isMobile, setIsMobile] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const { isOpen: isFilterModalOpen, openModal, closeModal } = Modal.useModal();
  const debouncedSearch = useDebouncedCallback((value: string) => {
    const param = appendParam({ ...queryParams, q: value, page: "1" });
    router.replace(`${pathname}?${param}`);
  }, 500);
  const {
    isOpen: isReportDrawerOpen,
    onOpenChange: onReportDrawerOpenChange,
    onOpen: onReportDrawerOpen,
  } = useDisclosure();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const { data, error, isLoading, mutate } = useSWR(
    [
      "reports",
      tab,
      page,
      rowsPerPage,
      sortBy,
      pic,
      category,
      priority,
      startDate,
      endDate,
      searchQuery,
    ],
    () =>
      fetchReports({
        offset: (page - 1) * rowsPerPage,
        limit: rowsPerPage,
        status: tab as string,
        searchValue: searchQuery || "",
        sortBy,
        filters: {
          category,
          priority,
          startDate,
          endDate,
          pic,
        },
      }),
    swrConfig,
  );

  const columnsBasedOnScreen = useMemo(() => {
    return isMobile
      ? columns.slice(0, 1)
      : isWideScreen
        ? columns
        : [...columns.slice(0, 3), ...columns.slice(4, 7)];
  }, [isMobile, isWideScreen, columns]);

  useEffect(() => {
    const handleResize = () => {
      if (!layoutRef.current) return;
      const mobile = layoutRef.current?.offsetWidth < 640;
      const wideScreen = layoutRef.current?.offsetWidth >= 900;
      setIsMobile(mobile);
      setIsWideScreen(wideScreen);
      calculateReportRow(setRowsPerPage, mobile, wideScreen);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onSortChange = (keys: Set<string>) => {
    const sortValue = Array.from(keys).join(", ").replace(/_/g, "");
    const param = appendParam({ ...queryParams, sortBy: sortValue });
    router.replace(`${pathname}?${param}`);
  };

  const onSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  const onClear = () => {
    const param = appendParam({ ...queryParams, q: "" });
    router.replace(`${pathname}?${param}`);
  };

  const onApplyFilter = (filterParams: string) => {
    router.replace(`${pathname}?${filterParams}`);
  };

  const onSelectTab = (key: Key) => {
    const param = appendParam({
      ...queryParams,
      status: key as string,
      page: "1",
    });

    router.replace(`${pathname}?${param}`);
  };

  const onPageChange = (page: number) => {
    const param = appendParam({ ...queryParams, page: page.toString() });
    router.replace(`${pathname}?${param}`);
  };

  const handleaPressPeek = (report: Report) => {
    onReportDrawerOpen();
    setSelectedReport(report);
  };

  const renderCell = useCallback(
    (report: Report, columnKey: string) => (
      <ReportCell
        columnKey={columnKey}
        report={report}
        isMobile={isMobile}
        isWideScreen={isWideScreen}
        onPressPeek={() => handleaPressPeek(report)}
      />
    ),
    [isMobile, isWideScreen],
  );

  const topContent = useMemo(() => {
    return (
      <TopContent
        onSearchChange={onSearchChange}
        onSearchClear={onClear}
        searchValue={searchQuery || ""}
        filters={[category, priority, startDate, pic]}
        onPressFilterButton={openModal}
        selectedTab={tab as string}
        onSelectTab={onSelectTab}
        selectedSortValue={sortBy}
        selectedSortKeys={new Set([sortBy])}
        onSortChange={onSortChange}
        isMobile={isMobile}
      />
    );
  }, [onSearchChange, onClear, sortBy, onSortChange, searchQuery, isMobile]);

  return (
    <Layout
      ref={layoutRef}
      isMobile={isMobile}
      title={t("title")}
      headerComponent={topContent}
      classNames={{ header: `gap-4 ${isMobile ? "sm:top-16 md:top-0" : ""}` }}
    >
      {error && <Error message={t("page-error-message")} onReset={mutate} />}
      {!error && (
        <>
          <div
            className={clsx(
              "flex mb-1",
              isMobile
                ? "pb-[72px] pt-40 sm:pt-[168px] px-1 md:px-4 md:pb-16 md:pt-60"
                : "px-6 pb-2",
            )}
          >
            <Table
              layout={isMobile ? "auto" : "fixed"}
              columns={columnsBasedOnScreen}
              items={data?.reports || []}
              isCompact
              removeWrapper={isMobile}
              hideHeader={isMobile}
              isLoading={isLoading}
              renderCell={renderCell}
              translationKey="ReportsPage"
            />
          </div>
          {data?.count! > 0 && (
            <div
              className={clsx(
                "flex w-full justify-center pt-4 md:pt-2 pb-4 bg-white",
                isMobile
                  ? "shadow-[rgba(5,5,5,0.1)_0_-1px_1px_0px] absolute bottom-0 z-10"
                  : "shadow-none sticky",
              )}
            >
              <Pagination
                showControls
                showShadow
                color="primary"
                page={page}
                total={Math.ceil(data?.count! / rowsPerPage)}
                onChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
      <FilterModal
        withFilterByUser={tab !== "PENDING"}
        isOpen={isFilterModalOpen}
        onClose={closeModal}
        queryParams={queryParams}
        onApplyFilter={onApplyFilter}
      />
      {selectedReport && (
        <DetailDrawer
          isOpen={isReportDrawerOpen}
          onOpenChange={onReportDrawerOpenChange}
          selectedReport={selectedReport}
        />
      )}
    </Layout>
  );
}

export default SuspensedReportsPage;

SuspensedReportsPage.displayName = "SuspensedReportsPage";

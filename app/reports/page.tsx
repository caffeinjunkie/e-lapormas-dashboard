"use client";

import { Button } from "@heroui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { useDisclosure } from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { Key } from "@react-types/shared";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

import { DetailDrawer } from "./detail-drawer";
import { FilterModal } from "./filter-modal";
import { TopContent } from "./top-content";

import { FilterType } from "@/api/tasks";
import { columns, swrConfig } from "@/app/reports/config";
import { fetchReports } from "@/app/reports/handlers";
import { ReportCell } from "@/app/reports/report-cell";
import Error from "@/components/error";
import { Layout } from "@/components/layout";
import { Modal } from "@/components/modal";
import { SingleSelectDropdown } from "@/components/single-select-dropdown";
import { Table } from "@/components/table";
import { Report } from "@/types/report.types";
import { calculateReportRow } from "@/utils/screen";

export default function ReportsPage() {
  const t = useTranslations("ReportsPage");
  const layoutRef = useRef<HTMLDivElement>(null);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isMobile, setIsMobile] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const { isOpen: isFilterModalOpen, openModal, closeModal } = Modal.useModal();
  const [tab, setTab] = useState<string>("PENDING");
  const [filters, setFilters] = useState<FilterType[]>([]);
  const { selected: selectedSortKeys, setSelected: setSelectedSortKeys } =
    SingleSelectDropdown.useDropdown(new Set(["newest"]));
  const [debouncedSearchQuery] = useDebounce(searchValue, 500);
  const {
    isOpen: isReportDrawerOpen,
    onOpenChange: onReportDrawerOpenChange,
    onOpen: onReportDrawerOpen,
  } = useDisclosure();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const selectedSortValue = useMemo(
    () => Array.from(selectedSortKeys).join(", ").replace(/_/g, ""),
    [selectedSortKeys],
  );
  let pages = 0;
  const { data, error, isLoading, mutate } = useSWR(
    [
      "reports",
      tab,
      page,
      rowsPerPage,
      selectedSortValue,
      filters,
      debouncedSearchQuery,
    ],
    () =>
      fetchReports({
        offset: (page - 1) * rowsPerPage,
        limit: rowsPerPage,
        status: tab,
        searchValue: debouncedSearchQuery,
        sortBy: selectedSortValue,
        filters,
      }),
    swrConfig,
  );

  if (data?.count) pages = Math.ceil(data.count / rowsPerPage);

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
    setSelectedSortKeys(keys);
    setPage(1);
  };

  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const onClear = () => {
    setSearchValue("");
    setPage(1);
  };

  const onApplyFilter = (constructedFilters: FilterType[]) => {
    setFilters(constructedFilters);
    setSearchValue("");
    setPage(1);
  };

  const onSelectTab = (key: Key) => {
    setTab(key as string);
    setPage(1);
  };

  const handleaPressPeek = (report: Report) => {
    onReportDrawerOpen();
    setSelectedReport(report);
  };

  const renderCell = useCallback(
    (report: Report, columnKey: string, isLast: boolean) => (
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
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearchClear={onClear}
        filterCount={filters.filter((f) => f.operator !== "lte").length}
        onPressFilterButton={openModal}
        selectedTab={tab}
        onSelectTab={onSelectTab}
        selectedSortValue={selectedSortValue}
        selectedSortKeys={selectedSortKeys}
        onSortChange={onSortChange}
        isMobile={isMobile}
      />
    );
  }, [
    searchValue,
    onSearchChange,
    onClear,
    selectedSortValue,
    selectedSortKeys,
    onSortChange,
    isMobile,
  ]);

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
          {pages > 0 && (
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
                total={pages}
                onChange={setPage}
              />
            </div>
          )}
        </>
      )}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={closeModal}
        onApplyFilter={onApplyFilter}
      />
      <DetailDrawer
        isMobile={isMobile}
        isOpen={isReportDrawerOpen}
        onOpenChange={onReportDrawerOpenChange}
        selectedReport={selectedReport}
      />
    </Layout>
  );
}

ReportsPage.displayName = "ReportsPage";

"use client";

import { Pagination } from "@heroui/pagination";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { handleFetchReports } from "./handlers";

import { columns } from "@/app/reports/config";
import { ReportCell } from "@/app/reports/report-cell";
import { Layout } from "@/components/layout";
import { Table } from "@/components/table";
import { Report, ReportCellType } from "@/types/report.types";
import { calculateReportRow } from "@/utils/screen";

export default function ReportsPage() {
  const t = useTranslations("ReportsPage");
  const layoutRef = useRef<HTMLDivElement>(null);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [pages, setPages] = useState(0);
  const [items, setItems] = useState<ReportCellType[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [page, setPage] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  const columnsBasedOnScreen = useMemo(() => {
    return isMobile
      ? columns.slice(0, 1)
      : isWideScreen
        ? columns
        : [...columns.slice(0, 3), ...columns.slice(4, 7)];
  }, [isMobile, isWideScreen, columns]);

  const transformedReports = useMemo(() => {
    return reports.map((report) => ({
      id: report.id,
      tracking_id: report.tracking_id,
      title: report.title,
      address: report.address,
      created_at: report.created_at,
      category: report.category,
      status: report.status,
      priority: report.priority,
    }));
  }, [reports]);

  const fetchReports = async (offset: number = 0) => {
    setIsDataLoading(true);
    try {
      const { data, count } = await handleFetchReports({
        offset,
        limit: rowsPerPage,
      });
      console.log(data, count);
      if (!count) return;
      setReports(data);
      setPages(Math.ceil(count / rowsPerPage));
    } catch (error) {
      console.error(error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const onPageChange = (newPage: number) => {
    setPage(newPage);
    fetchReports((newPage - 1) * rowsPerPage);
  };

  useEffect(() => {
    fetchReports();
  }, [rowsPerPage]);

  useEffect(() => {
    const handleResize = () => {
      if (!layoutRef.current) return;
      const mobile = layoutRef.current?.offsetWidth < 720;
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

  const renderCell = useCallback(
    (report: ReportCellType, columnKey: string, isLast: boolean) => (
      <ReportCell
        columnKey={columnKey}
        report={report}
        isMobile={isMobile}
        isWideScreen={isWideScreen}
      />
    ),
    [isMobile, isWideScreen],
  );

  return (
    <Layout
      ref={layoutRef}
      isMobile={isMobile}
      title={t("title")}
      classNames={{ header: "gap-4" }}
    >
      <div
        className={clsx(
          "flex mb-1",
          isMobile ? "pb-20 pt-1 px-1 sm:px-4" : "px-6 pb-2",
        )}
      >
        <Table
          layout={isMobile ? "auto" : "fixed"}
          columns={columnsBasedOnScreen}
          items={transformedReports}
          isCompact
          removeWrapper={isMobile}
          hideHeader={isMobile}
          isLoading={isDataLoading}
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
            onChange={onPageChange}
          />
        </div>
      )}
    </Layout>
  );
}

ReportsPage.displayName = "ReportsPage";

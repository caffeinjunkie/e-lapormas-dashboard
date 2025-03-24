"use client";

import { Pagination } from "@heroui/pagination";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { reports } from "./mock.data";

import { columns } from "@/app/reports/config";
import { ReportCell } from "@/app/reports/report-cell";
import { Layout } from "@/components/layout";
import { Table } from "@/components/table";
import { ReportCellType } from "@/types/report.types";
import { calculateRowNumber } from "@/utils/screen";

export default function ReportsPage() {
  const t = useTranslations("ReportsPage");
  const layoutRef = useRef<HTMLDivElement>(null);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [items, setItems] = useState<ReportCellType[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const columnsBasedOnScreen = isMobile
    ? columns.slice(0, 1)
    : isWideScreen
      ? columns
      : [...columns.slice(0, 3), ...columns.slice(4, 7)];

  useEffect(() => {
    // setIsDataLoading(true);
    // fetchAdmins();
    const transformedReports = reports.map((report) => ({
      id: report.id,
      tracking_id: report.tracking_id,
      title: report.title,
      address: report.address,
      created_at: report.created_at,
      category: report.category,
      status: report.status,
      priority: report.priority,
    }));

    setItems(transformedReports);

    const handleResize = () => {
      calculateRowNumber(setRowsPerPage);

      if (!layoutRef.current) return;
      setIsMobile(layoutRef.current?.offsetWidth < 720);
      setIsWideScreen(layoutRef.current?.offsetWidth >= 900);
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
          items={items}
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
            onChange={setPage}
          />
        </div>
      )}
    </Layout>
  );
}

ReportsPage.displayName = "ReportsPage";

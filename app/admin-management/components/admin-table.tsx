import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableProps,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { useTranslations } from "next-intl";

import { AdminData } from "@/types/user.types";

interface AdminTableProps extends TableProps {
  columns: {
    name: string;
    uid: string;
    width?: number;
    align?: string;
  }[];
  items: AdminData[];
  isLoading?: boolean;
  translationKey: string;
  renderCell: (
    user: AdminData,
    columnKey: string,
    isLast: boolean,
  ) => React.ReactNode;
  bottomContent?: React.ReactNode;
  topContent?: React.ReactNode;
}

export const AdminTable = ({
  columns = [],
  items = [],
  isLoading = false,
  renderCell,
  layout = "auto",
  bottomContentPlacement = "outside",
  topContentPlacement = "outside",
  translationKey,
  ...props
}: AdminTableProps) => {
  const t = useTranslations("AdminManagementPage");

  return (
    <Table
      layout={layout}
      bottomContentPlacement={bottomContentPlacement}
      topContentPlacement={topContentPlacement}
      aria-label={t("admin-management-title")}
      {...props}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            aria-label={column.name}
            width={column.width}
            align={(column.align as "start" | "center" | "end") || "start"}
          >
            {t(`table-${column.uid.replaceAll("_", "-")}-column-label`)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={items}
        isLoading={isLoading}
        emptyContent={
          <div className="text-center">{t("table-empty-content")}</div>
        }
        loadingContent={<Spinner />}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(
                  item,
                  columnKey as string,
                  item.id === items[items.length - 1].id,
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

import { Spinner } from "@heroui/spinner";
import {
  Table as HeroUITable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableProps,
  TableRow,
} from "@heroui/table";
import { useTranslations } from "next-intl";

interface AdminTableProps extends TableProps {
  columns: {
    name: string;
    uid: string;
    width?: number;
    align?: string;
  }[];
  items: any[];
  isLoading?: boolean;
  translationKey: string;
  renderCell: (item: any, columnKey: string) => React.ReactNode;
  bottomContent?: React.ReactNode;
  topContent?: React.ReactNode;
}

export const Table = ({
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
  const t = useTranslations(translationKey);

  return (
    <HeroUITable
      layout={layout}
      bottomContentPlacement={bottomContentPlacement}
      topContentPlacement={topContentPlacement}
      aria-label={t("title")}
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
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </HeroUITable>
  );
};

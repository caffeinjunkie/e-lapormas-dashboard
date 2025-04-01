import { Spinner } from "@heroui/spinner";
import {
  Table as HeroUITable,
  TableProps as HeroUITableProps,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useTranslations } from "next-intl";

interface TableProps extends HeroUITableProps {
  columns: {
    name: string;
    uid: string;
    width?: number;
    align?: string;
  }[];
  items: any[];
  isLoading?: boolean;
  translationKey: string;
  renderCell: (
    item: any,
    columnKey: string,
    isLast?: boolean,
  ) => React.ReactNode;
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
}: TableProps) => {
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
        {items.map((item, index) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(
                  item,
                  columnKey as string,
                  index === items.length - 1,
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </HeroUITable>
  );
};

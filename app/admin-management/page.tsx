"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  FormEvent,
} from "react";
import { Pagination } from "@heroui/pagination";
import { addToast } from "@heroui/toast";
import { PressEvent } from "@heroui/button";
import { Form } from "@heroui/form";
import { useTranslations } from "next-intl";
import { ModalHeader, ModalBody } from "@heroui/modal";
import { Input } from "@heroui/input";

import { Layout } from "@/components/layout";
import { AdminTable } from "@/app/admin-management/components/admin-table";
import {
  fetchAdminsHandler,
  calculateRowNumber,
  handleToggle,
  filterUsers,
} from "@/app/admin-management/handlers";
import { AdminData } from "@/types/user.types";
import { upsertAdmins } from "@/api/admin";
import { columns } from "@/app/admin-management/config";
import { TopContent } from "./components/top-content";
import { AdminCell } from "./components/admin-cell";
import { useFilterSingleSelect } from "@/components/filter-dropdown/use-filter-single-select";
import { Modal, ModalButtonProps } from "@/components/modal";
import { useModal } from "@/components/modal/use-modal";
import { validateEmail, validateIsRequired } from "@/utils/string";
import { buildFormData } from "@/utils/form";

export default function AdminManagementPage() {
  const t = useTranslations("AdminManagementPage");
  const [page, setPage] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [originalAdmins, setOriginalAdmins] = useState<AdminData[]>([]);
  const [updatedAdmins, setUpdatedAdmins] = useState<AdminData[]>([]);
  const [selfId, setSelfId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [filterValue, setFilterValue] = React.useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState<"invite" | "delete" | "">("");
  const [emailValid, setEmailValid] = useState(false);
  const [deletedAdminId, setDeletedAdminId] = useState<string | null>(null);
  const { isOpen, closeModal, openModal } = useModal();

  const {
    selected: selectedStatusFilterKeys,
    setSelected: setSelectedStatusFilterKeys,
  } = useFilterSingleSelect(new Set(["all"]));
  const hasSearchFilter = Boolean(filterValue);

  const selectedStatusFilterValue = React.useMemo(
    () => Array.from(selectedStatusFilterKeys).join(", ").replace(/_/g, ""),
    [selectedStatusFilterKeys],
  );

  const fetchAdmins = async () => {
    try {
      const { admins, userId } = await fetchAdminsHandler();

      setSelfId(userId);
      setAdmins(admins as AdminData[]);
      setOriginalAdmins(admins as AdminData[]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    setIsDataLoading(true);
    fetchAdmins();

    const handleResize = () => calculateRowNumber(setRowsPerPage);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredItems = React.useMemo(
    () =>
      filterUsers(
        admins,
        hasSearchFilter,
        filterValue,
        selectedStatusFilterValue,
        selectedStatusFilterKeys,
      ),
    [admins, filterValue, selectedStatusFilterKeys],
  );

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onSave = async () => {
    setIsSaveLoading(true);
    try {
      const result = await upsertAdmins(updatedAdmins);
      if (result) {
        await fetchAdmins();
      }

      addToast({
        title: t("admin-management-save-success-toast-title"),
        description: t("admin-management-save-success-toast-description", {
          label:
            updatedAdmins.length > 1
              ? t("admin-management-users-count-text", {
                  count: updatedAdmins.length,
                })
              : updatedAdmins[0].email,
        }),
        color: "success",
      });

      setUpdatedAdmins([]);
    } catch (error) {
      addToast({
        title: t("admin-management-error-toast-title"),
        description: t("admin-management-error-toast-description"),
        color: "danger",
      });
      console.error(error);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const onCloseModal = () => {
    closeModal();
    setModalTitle("");
    setModalType("");
    setDeletedAdminId(null);
  };

  const onConfirmDelete = (e: PressEvent) => {
    console.log("Confirm delete");
    // TODO: open confirm delete modal
    // then create onConfirmDelete function
  };

  const onSendInvite = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);

    //TODO: to be implemented in next card
    console.log("Send invite", formData);
    addToast({
      title: t("admin-management-invite-user-success-toast-title"),
      description: t.rich(
        "admin-management-invite-user-success-toast-description",
        {
          email: formData.get("email") as string,
          bold: (chunks) => <strong>{chunks}</strong>,
        },
      ) as string,
      timeout: 6000,
      color: "success",
    });

    onCloseModal();
  };

  const onInviteUser = () => {
    openModal();
    setModalTitle(t("admin-management-invite-user-modal-title"));
    setModalType("invite");
  };

  const handleDelete = (user: AdminData) => {
    openModal();
    setModalTitle(
      t("admin-management-delete-user-modal-title", { email: user.email }),
    );
    setModalType("delete");
  };

  const modalButtons = useMemo(() => {
    if (modalType === "invite") {
      return [
        {
          title: t(
            "admin-management-invite-user-modal-cancellation-button-text",
          ),
          onPress: onCloseModal,
        },
        {
          title: t(
            "admin-management-invite-user-modal-confirmation-button-text",
          ),
          color: "warning",
          type: "submit",
          formId: "invite-form",
          variant: "solid",
          className: "text-white",
        },
      ] as ModalButtonProps[];
    }

    if (modalType === "delete") {
      return [
        {
          title: t(
            "admin-management-delete-user-modal-confirmation-button-text",
          ),
          color: "danger",
          onPress: onConfirmDelete,
        },
        {
          title: t(
            "admin-management-delete-user-modal-cancellation-button-text",
          ),
          color: "primary",
          variant: "solid",
          onPress: onCloseModal,
        },
      ] as ModalButtonProps[];
    }

    return [];
  }, [modalType]);

  const topContent = React.useMemo(() => {
    return (
      <TopContent
        searchValue={filterValue}
        onSearchChange={onSearchChange}
        onSearchClear={onClear}
        selectedStatusFilterValue={selectedStatusFilterValue}
        selectedStatusFilterKeys={selectedStatusFilterKeys}
        onStatusFilterChange={(keys) => {
          setSelectedStatusFilterKeys(keys as Set<string>);
        }}
        isSaveButtonLoading={isSaveLoading}
        isSaveButtonDisabled={updatedAdmins.length === 0}
        onInviteUser={onInviteUser}
        onSave={onSave}
      />
    );
  }, [
    filterValue,
    selectedStatusFilterKeys,
    onSearchChange,
    hasSearchFilter,
    updatedAdmins,
    isSaveLoading,
  ]);

  const renderCell = useCallback(
    (user: AdminData, columnKey: string) => (
      <AdminCell
        columnKey={columnKey}
        user={user}
        selfId={selfId}
        onSuperAdminToggle={() =>
          handleToggle({
            user,
            setAdmins,
            setUpdatedAdmins,
            originalAdmins,
          })
        }
        onDeleteUser={() => handleDelete(user)}
      />
    ),
    [selfId, handleToggle, handleDelete],
  );

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-center md:text-left">
        {t("admin-management-title")}
      </h1>
      <div className="flex py-4 md:pt-8">
        <AdminTable
          columns={columns}
          items={items}
          isLoading={isDataLoading}
          renderCell={renderCell}
          topContent={topContent}
          bottomContent={
            pages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={setPage}
                />
              </div>
            ) : null
          }
          translationKey="AdminManagementPage"
        />
      </div>
      <Modal
        className="focus:outline-none"
        onClose={onCloseModal}
        isOpen={isOpen}
        buttons={modalButtons}
      >
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalBody>
          {modalType === "invite" && (
            <div>
              <Form method="post" id="invite-form" onSubmit={onSendInvite}>
                <Input
                  label={t("admin-management-invite-user-modal-input-label")}
                  name="email"
                  type="email"
                  aria-label="email"
                  isRequired
                  validate={(value) =>
                    validateIsRequired(t, value, "email") ||
                    validateEmail(t, value)
                  }
                />
              </Form>
            </div>
          )}
          {modalType === "delete" && (
            <div>
              <p>{t("admin-management-delete-user-modal-description")}</p>
            </div>
          )}
        </ModalBody>
      </Modal>
    </Layout>
  );
}

AdminManagementPage.displayName = "AdminManagementPage";

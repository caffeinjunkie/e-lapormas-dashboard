"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { ModalBody, ModalHeader } from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AdminTable } from "@/app/admin-management/components/admin-table";
import { columns } from "@/app/admin-management/config";
import {
  calculateRowNumber,
  fetchAdminsHandler,
  filterUsers,
  handleToggle,
} from "@/app/admin-management/handlers";

import { useFilterSingleSelect } from "@/components/filter-dropdown/use-filter-single-select";
import { Layout } from "@/components/layout";
import { Modal, ModalButtonProps } from "@/components/modal";
import { useModal } from "@/components/modal/use-modal";

import {
  checkIsUserAlreadyInvited,
  createAdmin,
  upsertAdmins,
} from "@/api/admin";
import { deleteAuthUser, inviteByEmail } from "@/api/users";

import { buildFormData } from "@/utils/form";
import { validateEmail, validateIsRequired } from "@/utils/string";

import { AdminData } from "@/types/user.types";

import { AdminCell } from "./components/admin-cell";
import { TopContent } from "./components/top-content";

export default function AdminManagementPage() {
  const t = useTranslations("AdminManagementPage");
  const [page, setPage] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [originalAdmins, setOriginalAdmins] = useState<AdminData[]>([]);
  const [updatedAdmins, setUpdatedAdmins] = useState<AdminData[]>([]);
  const [selfId, setSelfId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [filterValue, setFilterValue] = React.useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState<"invite" | "delete" | "">("");
  const [deletedAdmin, setDeletedAdmin] = useState<AdminData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, closeModal, openModal } = useModal();
  const layoutRef = useRef<HTMLDivElement>(null);

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
      const { admins, currentUserId } = await fetchAdminsHandler();

      setAdmins(admins as AdminData[]);
      setOriginalAdmins(admins as AdminData[]);
      setSelfId(currentUserId);
    } catch (error) {
      addToast({
        title: t("admin-management-default-error-toast-title"),
        description: t("admin-management-default-error-toast-description"),
        color: "danger",
      });
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    setIsDataLoading(true);
    fetchAdmins();

    const handleResize = () => {
      calculateRowNumber(setRowsPerPage);

      if (!layoutRef.current) return;
      setIsMobile(layoutRef.current?.offsetWidth < 520);
    };

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
    let toastProps = {};
    try {
      const result = await upsertAdmins(updatedAdmins);
      if (result) {
        await fetchAdmins();
      }

      toastProps = {
        title: t("admin-management-save-success-toast-title"),
        description: t.rich("admin-management-save-success-toast-description", {
          label:
            updatedAdmins.length > 1
              ? t("admin-management-users-count-text", {
                  count: updatedAdmins.length,
                })
              : (updatedAdmins[0].email as string),
          bold: (chunks) =>
            updatedAdmins.length > 1 ? chunks : <strong>{chunks}</strong>,
        }) as string,
        color: "success",
      };

      setUpdatedAdmins([]);
    } catch (error) {
      toastProps = {
        title: t("admin-management-save-error-toast-title"),
        description: t("admin-management-save-error-toast-description"),
        color: "danger",
      };
    } finally {
      addToast(toastProps);
      setIsSaveLoading(false);
    }
  };

  const onCloseModal = () => {
    closeModal();
    setModalTitle("");
    setModalType("");
    setDeletedAdmin(null);
  };

  const onConfirmDelete = async () => {
    if (!deletedAdmin) {
      return;
    }
    let toastProps = {};

    try {
      const { success } = await deleteAuthUser(deletedAdmin?.user_id || "");

      if (success) {
        await fetchAdmins();
        toastProps = {
          title: t("admin-management-delete-success-toast-title"),
          description: t.rich(
            "admin-management-delete-success-toast-description",
            {
              email: deletedAdmin.email as string,
              bold: (chunks) => <strong>{chunks}</strong>,
            },
          ) as string,
          color: "success",
        };
      }
    } catch (error) {
      toastProps = {
        title: t("admin-management-delete-error-toast-title"),
        description: t("admin-management-delete-error-toast-description"),
        color: "danger",
      };
    } finally {
      setIsDataLoading(false);
      addToast(toastProps);
      onCloseModal();
    }
  };

  const onSendInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = buildFormData(e);
    let toastProps = {};
    setIsInviteLoading(true);

    try {
      const isUserAlreadyInvited = await checkIsUserAlreadyInvited(
        formData.get("email") as string,
      );
      if (isUserAlreadyInvited) {
        toastProps = {
          title: t("admin-management-invite-user-warning-toast-title"),
          description: t.rich(
            "admin-management-invite-user-warning-toast-description",
            {
              email: formData.get("email") as string,
              bold: (chunks) => <strong>{chunks}</strong>,
            },
          ) as string,
          timeout: 6000,
          color: "warning",
        };
        return;
      }
      const { data } = await inviteByEmail(formData.get("email") as string);
      await createAdmin({
        email: formData.get("email") as string,
        user_id: data.user.id,
      });
      await fetchAdmins();
      toastProps = {
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
      };
    } catch (error) {
      toastProps = {
        title: t("admin-management-invite-user-error-toast-title"),
        description: t("admin-management-invite-user-error-toast-description"),
        color: "danger",
      };
    } finally {
      setIsInviteLoading(false);
      addToast(toastProps);
      onCloseModal();
    }
  };

  const onInviteUser = () => {
    openModal();
    setModalTitle(t("admin-management-invite-user-modal-title"));
    setModalType("invite");
  };

  const handleDelete = (user: AdminData) => {
    openModal();
    setModalTitle(
      t.rich("admin-management-delete-user-modal-title", {
        email: user.email as string,
        bold: (chunks) => <strong>{chunks}</strong>,
      }) as string,
    );
    setModalType("delete");
    setDeletedAdmin(user);
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
          isLoading: isInviteLoading,
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
  }, [modalType, isInviteLoading]);

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
    (user: AdminData, columnKey: string, isLast: boolean) => (
      <AdminCell
        columnKey={columnKey}
        user={user}
        isMobile={isMobile}
        isLast={isLast}
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
    [selfId, handleToggle, handleDelete, isMobile],
  );

  return (
    <Layout ref={layoutRef}>
      <h1 className="text-2xl font-bold text-center md:text-left">
        {t("admin-management-title")}
      </h1>
      <div className="flex py-4 lg:pt-8">
        <AdminTable
          layout={isMobile ? "auto" : "fixed"}
          columns={isMobile ? [{ name: "NAME", uid: "display_name" }] : columns}
          items={items}
          hideHeader={isMobile}
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
        autoFocus={false}
        className="focus:outline-none"
        onClose={onCloseModal}
        isOpen={isOpen}
        buttons={modalButtons}
      >
        <ModalHeader>
          <p>{modalTitle}</p>
        </ModalHeader>
        <ModalBody>
          {modalType === "invite" && (
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
          )}
          {modalType === "delete" && (
            <p>{t("admin-management-delete-user-modal-description")}</p>
          )}
        </ModalBody>
      </Modal>
    </Layout>
  );
}

AdminManagementPage.displayName = "AdminManagementPage";

"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { ModalBody, ModalHeader } from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { ToastProps, addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AdminCell } from "./components/admin-cell";
import { TopContent } from "./components/top-content";

import {
  checkIsUserAlreadyInvited,
  createAdmin,
  upsertAdmins,
} from "@/api/admin";
import { createAuthUser } from "@/api/auth";
import { deleteAuthUser } from "@/api/users";
import { AdminTable } from "@/app/admin-management/components/admin-table";
import {
  columns,
  footerClassNames,
  headerClassNames,
} from "@/app/admin-management/config";
import {
  calculateRowNumber,
  fetchAdminsHandler,
  filterUsers,
  getErrorToastProps,
  handleToggle,
} from "@/app/admin-management/handlers";
import { setCookie } from "@/app/admin-management/handlers";
import { useFilterSingleSelect } from "@/components/filter-dropdown/use-filter-single-select";
import { Layout } from "@/components/layout";
import { Modal, ModalButtonProps } from "@/components/modal";
import { useMultipleModal } from "@/components/modal/use-modal";
import { AdminData } from "@/types/user.types";
import { buildFormData } from "@/utils/form";
import { validateEmail, validateIsRequired } from "@/utils/string";

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
  const [deletedAdmin, setDeletedAdmin] = useState<AdminData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { modals, openModal, closeModal } = useMultipleModal();
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
      addToast(getErrorToastProps(t) as ToastProps);
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

  const onSearchChange = (value: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
    setPage(1);
  };

  const onClear = () => {
    setFilterValue("");
    setPage(1);
  };

  const onSave = async () => {
    setIsSaveLoading(true);
    let toastProps = {};
    try {
      const result = await upsertAdmins(updatedAdmins);
      if (result) {
        await fetchAdmins();
      }
      let description = "";
      const onlyOneAdmin = updatedAdmins.length === 1;
      const targetEmail = updatedAdmins[0].email as string;
      const targetIsSuperAdmin = updatedAdmins[0].is_super_admin as boolean;

      if (onlyOneAdmin) {
        description = t.rich(
          `${targetIsSuperAdmin ? "save" : "remove"}-super-admin-success-toast-description`,
          {
            label: targetEmail,
            bold: (chunks) => <strong>{chunks}</strong>,
          },
        ) as string;
      } else {
        description = t("save-all-success-toast-description", {
          count: updatedAdmins.length,
        });
      }

      toastProps = {
        title: t("save-success-toast-title"),
        description,
        color: "success",
      };

      setUpdatedAdmins([]);
    } catch (error) {
      toastProps = getErrorToastProps(t, "save");
    } finally {
      addToast(toastProps);
      setIsSaveLoading(false);
    }
  };

  const onCloseModal = (modalName: string) => {
    closeModal(modalName);
    setModalTitle("");
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
          title: t("delete-success-toast-title"),
          description: t.rich("delete-success-toast-description", {
            email: deletedAdmin.email as string,
            bold: (chunks) => <strong>{chunks}</strong>,
          }) as string,
          color: "success",
        };
      }
    } catch (error) {
      toastProps = getErrorToastProps(t, "delete");
    } finally {
      setIsDataLoading(false);
      addToast(toastProps);
      onCloseModal("delete");
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
          title: t("invite-user-warning-toast-title"),
          description: t.rich("invite-user-warning-toast-description", {
            email: formData.get("email") as string,
            bold: (chunks) => <strong>{chunks}</strong>,
          }) as string,
          timeout: 6000,
          color: "warning",
        };
        return;
      }
      const email = formData.get("email") as string;
      const { data } = await createAuthUser(email);

      if (data) {
        const userId = data?.user?.id as string;
        const timestamp = Date.now().toString();
        setCookie(timestamp, userId, 1);

        await createAdmin({
          email,
          user_id: userId,
        });
      }

      await fetchAdmins();

      toastProps = {
        title: t("invite-user-success-toast-title"),
        description: t.rich("invite-user-success-toast-description", {
          email: formData.get("email") as string,
          bold: (chunks) => <strong>{chunks}</strong>,
        }) as string,
        timeout: 6000,
        color: "success",
      };
    } catch (error) {
      toastProps = getErrorToastProps(t, "invite");
    } finally {
      setIsInviteLoading(false);
      addToast(toastProps);
      onCloseModal("invite");
    }
  };

  const onInviteUser = () => {
    openModal("invite");
    setModalTitle(t("invite-user-modal-title"));
  };

  const handleDelete = (user: AdminData) => {
    openModal("delete");
    setModalTitle(
      t.rich("delete-user-modal-title", {
        email: user.email as string,
        bold: (chunks) => <strong>{chunks}</strong>,
      }) as string,
    );
    setDeletedAdmin(user);
  };

  const modalButtons = useMemo(() => {
    if (modals.invite) {
      return [
        {
          title: t("invite-user-modal-cancellation-button-text"),
          isDisabled: isInviteLoading,
          onPress: () => onCloseModal("invite"),
        },
        {
          title: t("invite-user-modal-confirmation-button-text"),
          isLoading: isInviteLoading,
          color: "warning",
          type: "submit",
          formId: "invite-form",
          variant: "solid",
          className: "text-white",
        },
      ] as ModalButtonProps[];
    }

    if (modals.delete) {
      return [
        {
          title: t("delete-user-modal-confirmation-button-text"),
          color: "danger",
          onPress: onConfirmDelete,
        },
        {
          title: t("delete-user-modal-cancellation-button-text"),
          color: "primary",
          variant: "solid",
          onPress: () => onCloseModal("delete"),
        },
      ] as ModalButtonProps[];
    }

    return [];
  }, [modals, isInviteLoading]);

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
        isMobile={isMobile}
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
    isMobile,
    updatedAdmins,
    isSaveLoading,
  ]);

  const renderCell = useCallback(
    (user: AdminData, columnKey: string, isLast: boolean) => (
      <AdminCell
        columnKey={columnKey}
        user={user}
        admins={admins}
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
    [selfId, handleToggle, handleDelete, isMobile, admins],
  );

  return (
    <Layout
      ref={layoutRef}
      title={t("title")}
      classNames={{ container: "py-0", title: "px-6 pt-6" }}
    >
      <div className={headerClassNames}>{topContent}</div>
      <div className="flex px-6 pb-20 md:pb-2 pt-28 md:pt-0 md:mt-0 mb-1">
        <AdminTable
          layout={isMobile ? "auto" : "fixed"}
          columns={isMobile ? [{ name: "NAME", uid: "display_name" }] : columns}
          items={items}
          hideHeader={isMobile}
          isLoading={isDataLoading}
          renderCell={renderCell}
          translationKey="AdminManagementPage"
        />
      </div>
      {pages > 0 && (
        <div className={footerClassNames}>
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
      <Modal
        className="focus:outline-none"
        onClose={() => onCloseModal(modals.invite ? "invite" : "delete")}
        isOpen={modals.invite || modals.delete}
        buttons={modalButtons}
      >
        <ModalHeader>
          <p>{modalTitle}</p>
        </ModalHeader>
        <ModalBody>
          {modals.invite && (
            <Form method="post" id="invite-form" onSubmit={onSendInvite}>
              <Input
                label={t("invite-user-modal-input-label")}
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
          {modals.delete && <p>{t("delete-user-modal-description")}</p>}
        </ModalBody>
      </Modal>
    </Layout>
  );
}

AdminManagementPage.displayName = "AdminManagementPage";

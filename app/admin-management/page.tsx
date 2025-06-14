"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { ModalBody, ModalHeader } from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { SharedSelection } from "@heroui/system";
import { ToastProps, addToast } from "@heroui/toast";
import { Tooltip } from "@heroui/tooltip";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSWR from "swr";

import { swrConfig } from "../config";
import { AdminCell } from "./admin-cell";
import { TopContent } from "./top-content";

import { checkIsUserAlreadyInvited, upsertAdmins } from "@/api/admin";
import { fetchAppConfig } from "@/api/app-config";
import { createAuthUser } from "@/api/auth";
import { deleteAuthUser } from "@/api/users";
import { columns } from "@/app/admin-management/config";
import { getAllAdmins } from "@/app/admin-management/handlers";
import {
  filterUsers,
  getErrorToastProps,
  transformAdmins,
} from "@/app/admin-management/utils";
import { setCookie } from "@/app/admin-management/utils";
import { AdminIcon, SuperAdminIcon } from "@/components/icons";
import { Layout } from "@/components/layout";
import { Modal, ModalButtonProps } from "@/components/modal";
import { SingleSelectDropdown } from "@/components/single-select-dropdown";
import { Table } from "@/components/table";
import { usePrivate } from "@/providers/private-provider";
import { AdminData } from "@/types/user.types";
import { buildFormData } from "@/utils/form";
import { calculateAdminRow } from "@/utils/screen";
import { validateEmail, validateIsRequired } from "@/utils/string";

export default function AdminManagementPage() {
  const t = useTranslations("AdminManagementPage");
  const { setShouldShowConfirmation } = usePrivate();
  const [page, setPage] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [originalAdmins, setOriginalAdmins] = useState<AdminData[]>([]);
  const [updatedAdmins, setUpdatedAdmins] = useState<AdminData[]>([]);
  const [selfId, setSelfId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filterValue, setFilterValue] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [deletedAdmin, setDeletedAdmin] = useState<AdminData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { modals, openModal, closeModal } = Modal.useMultipleModal();
  const layoutRef = useRef<HTMLDivElement>(null);

  const {
    selected: selectedStatusFilterKeys,
    setSelected: setSelectedStatusFilterKeys,
  } = SingleSelectDropdown.useDropdown(new Set(["all"]));
  const hasSearchFilter = Boolean(filterValue);

  const selectedStatusFilterValue = useMemo(
    () => Array.from(selectedStatusFilterKeys).join(", ").replace(/_/g, ""),
    [selectedStatusFilterKeys],
  );

  const { data: appConfig, isValidating: isAppConfigValidating } = useSWR(
    ["app-config"],
    () => fetchAppConfig(),
    swrConfig,
  );

  const fetchAdmins = async () => {
    try {
      const { admins, currentUserId } = await getAllAdmins();

      setAdmins(admins as AdminData[]);
      setOriginalAdmins(admins as AdminData[]);
      setSelfId(currentUserId);
    } catch (error) {
      addToast(getErrorToastProps(t, "fetch") as ToastProps);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    setIsDataLoading(true);
    fetchAdmins();

    const handleResize = () => {
      calculateAdminRow(setRowsPerPage);

      if (!layoutRef.current) return;
      setIsMobile(layoutRef.current?.offsetWidth < 520);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setShouldShowConfirmation(updatedAdmins.length > 0);
  }, [updatedAdmins]);

  const filteredItems = useMemo(
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

  const items = useMemo(() => {
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

  const onStatusFilterChange = (keys: Set<string>) => {
    setSelectedStatusFilterKeys(keys);
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

  const topContent = useMemo(() => {
    return (
      <TopContent
        searchValue={filterValue}
        onSearchChange={onSearchChange}
        onSearchClear={onClear}
        isAdminsSlotAvailable={admins.length < appConfig?.subscription.admins}
        selectedStatusFilterValue={selectedStatusFilterValue}
        selectedStatusFilterKeys={selectedStatusFilterKeys}
        onStatusFilterChange={
          onStatusFilterChange as (keys: SharedSelection) => void
        }
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
    updatedAdmins,
    isSaveLoading,
  ]);

  const renderCell = useCallback(
    (user: AdminData, columnKey: string, isLast?: boolean) => (
      <AdminCell
        columnKey={columnKey}
        user={user}
        admins={admins}
        isSuperAdminSlotAvailable={
          admins.filter((item) => item.is_super_admin).length <
          appConfig.subscription.super_admins
        }
        isMobile={isMobile}
        isLast={isLast ?? false}
        selfId={selfId}
        onSuperAdminToggle={() =>
          transformAdmins({
            user,
            setAdmins,
            setUpdatedAdmins,
            originalAdmins,
          })
        }
        onDeleteUser={() => handleDelete(user)}
      />
    ),
    [selfId, transformAdmins, handleDelete, isMobile, admins],
  );

  return (
    <Layout
      ref={layoutRef}
      headerComponent={topContent}
      isMobile={isMobile}
      title={t("title")}
      classNames={{ header: "gap-4" }}
    >
      <div
        className={clsx(
          "flex mb-1 flex-col",
          isMobile ? "pb-20 pt-28 md:pt-48 px-4" : " px-6 pb-2",
        )}
      >
        {isAppConfigValidating ? (
          <Spinner />
        ) : (
          <div className="flex flex-row text-sm font-semibold gap-3 w-full items-center justify-center md:justify-end pb-2">
            <div className="flex flex-row gap-1 items-center">
              <Tooltip content="Super Admin">
                <SuperAdminIcon size={18} stroke="#000000" />
              </Tooltip>
              <p
                className={clsx(
                  admins.filter((item) => item.is_super_admin).length >=
                    appConfig?.subscription?.super_admins
                    ? "text-default-700"
                    : "text-default-500",
                )}
              >{`${admins.filter((item) => item.is_super_admin).length}/${appConfig.subscription.super_admins} `}</p>
            </div>
            <div className="flex flex-row gap-1 items-center">
              <Tooltip content="Admin">
                <AdminIcon size={18} stroke="#000000" />
              </Tooltip>
              <p
                className={clsx(
                  admins.length >= appConfig.subscription.admins
                    ? "text-default-700"
                    : "text-default-500",
                )}
              >{`${admins.length}/${appConfig.subscription.admins}`}</p>
            </div>
          </div>
        )}
        <Table
          layout={isMobile ? "auto" : "fixed"}
          columns={isMobile ? [{ name: "NAME", uid: "display_name" }] : columns}
          items={items}
          isCompact
          removeWrapper={isMobile}
          hideHeader={isMobile}
          isLoading={isDataLoading}
          renderCell={renderCell}
          translationKey="AdminManagementPage"
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

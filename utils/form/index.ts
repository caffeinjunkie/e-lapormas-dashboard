import { FormEvent } from "react";

const buildFormData = (event: FormEvent<HTMLFormElement>) => {
  let data = new FormData();

  Object.entries(event.currentTarget).forEach(([_, formItem]) => {
    if (formItem.name !== undefined && formItem.name.includes("switch")) {
      data.append(formItem.name, formItem.checked);
    }
    if (
      formItem.localName === "input" ||
      formItem.localName === "select" ||
      formItem.localName === "textarea"
    ) {
      data.append(formItem.name, formItem.value);
    }
  });

  return data;
};

export { buildFormData };

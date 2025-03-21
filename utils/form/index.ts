import { FormEvent } from "react";

const buildFormData = (event: FormEvent<HTMLFormElement>) => {
  let data = new FormData();

  Object.entries(event.currentTarget).forEach(([_, formItem]) => {
    if (formItem.localName === "input" || formItem.localName === "select") {
      data.append(formItem.name, formItem.value);
    }
  });

  return data;
};

export { buildFormData };

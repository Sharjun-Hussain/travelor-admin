import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function capitalizeString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const exportToExcel = (data, filename = "data") => {
  // 1. Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 2. Create a new workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 3. Write the workbook to binary array
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // 4. Create a Blob and trigger download
  const fileData = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(fileData, `${filename}.xlsx`);
};

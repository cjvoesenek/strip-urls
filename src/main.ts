import { stripUrl } from "./lib/strip";
import "./main.css";

const original = document.getElementById("original") as HTMLTextAreaElement;
const cleaned = document.getElementById("cleaned") as HTMLTextAreaElement;

addUrlChangeListener();

addSelectAllListener(original);
addSelectAllListener(cleaned);

function addUrlChangeListener(): void {
  original.addEventListener("input", () => {
    try {
      const cleanedUrl = stripUrl(original.value);
      cleaned.value = cleanedUrl.toString();
    } catch {
      cleaned.value = "";
    }
  });
}

function addSelectAllListener(element: HTMLTextAreaElement): void {
  element.addEventListener("focus", () => element.select());
}

import { stripUrl } from "./lib/strip";
import "./main.css";

const original = document.getElementById("original") as HTMLTextAreaElement;
const cleaned = document.getElementById("cleaned") as HTMLTextAreaElement;

const clearButton = document.getElementById("clear") as HTMLButtonElement;
const goButton = document.getElementById("go") as HTMLButtonElement;
const copyButton = document.getElementById("copy") as HTMLButtonElement;
const copiedText = document.getElementById("copied") as HTMLSpanElement;

addUrlChangeListener();

addSelectAllListener(original);
addSelectAllListener(cleaned);

addClearListener();
addGoListener();
addCopyListener();

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

function addClearListener(): void {
  clearButton.addEventListener("click", () => {
    original.value = "";
    cleaned.value = "";
  });
}

function addGoListener(): void {
  goButton.addEventListener("click", () => {
    window.open(cleaned.value);
  });
}

let timeoutHandle: ReturnType<typeof window.setTimeout> | null = null;
function addCopyListener(): void {
  copyButton.addEventListener("click", () => {
    navigator.clipboard
      .writeText(cleaned.value)
      .then(() => {
        copiedText.classList.add("visible");

        if (timeoutHandle) window.clearTimeout(timeoutHandle);
        timeoutHandle = window.setTimeout(() => {
          copiedText.classList.remove("visible");
          timeoutHandle = null;
        }, 2000);
      })
      .catch((error) =>
        console.error(`Failed to write URL to clipboard: ${error}`),
      );
  });
}

import { stripUrl } from "./lib/strip";
import "./main.css";

const original = document.getElementById("original") as HTMLTextAreaElement;
const cleaned = document.getElementById("cleaned") as HTMLTextAreaElement;

original.addEventListener("input", () => {
  try {
    const cleanedUrl = stripUrl(original.value);
    cleaned.value = cleanedUrl.toString();
  } catch {
    cleaned.value = "";
  }
});

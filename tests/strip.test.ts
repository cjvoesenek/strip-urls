import { expect, test } from "vitest";
import { stripUrl } from "../src/lib/strip";

test("leaves unpolluted URLs unchanged", () => {
  const stripped = stripUrl("https://www.example.com");
  expect(stripped.toString()).toBe("https://www.example.com/");
});

test("fails on an invalid URL", () => {
  // No protocol.
  expect(() => stripUrl("www.example.com")).toThrowError();
});

test("strips Outlook checked URL without path", () => {
  const stripped = stripUrl(
    "https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.example.com%2F&data=05%7C02%7Ccees.voesenek%40vortech.nl%7Cee1bc8a118a449dd366d08ddb805809b%7C5fe8f8070fe44cdf8dc636475a0b8555%7C0%7C0%7C638869055948400761%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=Ji5IrmJjqAoHkXWZL91G9nzkfLX5Bg%2B3liA6q4IBNv4%3D&reserved=0",
  );
  expect(stripped.toString()).toBe("https://www.example.com/");
});

test("strips Outlook checked URL with path", () => {
  const stripped = stripUrl(
    "https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.example.com%2Fpath%2Fto%2Fsomething.html&data=05%7C02%7Ccees.voesenek%40vortech.nl%7C33becd5a594b4e2ce4a608ddb808ac5e%7C5fe8f8070fe44cdf8dc636475a0b8555%7C0%7C0%7C638869069573586680%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=i34tZgRECAPnh5ky6xvezYTAV9H8ygIV1ceSZ7OOi04%3D&reserved=0",
  );
  expect(stripped.toString()).toBe(
    "https://www.example.com/path/to/something.html",
  );
});

test("fails on an invalid inner URL in an Outlook checked URL", () => {
  expect(() =>
    stripUrl(
      "https://eur01.safelinks.protection.outlook.com/?url=www.example.com%2Fpath%2Fto%2Fsomething.html&data=05%7C02%7Ccees.voesenek%40vortech.nl%7C33becd5a594b4e2ce4a608ddb808ac5e%7C5fe8f8070fe44cdf8dc636475a0b8555%7C0%7C0%7C638869069573586680%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=i34tZgRECAPnh5ky6xvezYTAV9H8ygIV1ceSZ7OOi04%3D&reserved=0",
    ),
  ).toThrowError();
});

test("strips URL Defense checked URL without path and single slash in protocol", () => {
  const stripped = stripUrl(
    "https://urldefense.com/v3/__https:/myaccount.microsoft.com/__;!!A4qNoLW32FtaT8k!XwN3YWhQ6OUWAI1MqCF0ZI-VBFE4eQzRDJpU206LMXlWDlBU__92egaLgxeOSJH1VjPlZvBP_IJcwJI2ONVextaWJxPHtD2V16glRJI$",
  );
  expect(stripped.toString()).toBe("https://myaccount.microsoft.com/");
});

test("strips URL Defense checked URL without path and double slash in protocol", () => {
  const stripped = stripUrl(
    "https://urldefense.com/v3/__https://myaccount.microsoft.com/__;!!A4qNoLW32FtaT8k!XwN3YWhQ6OUWAI1MqCF0ZI-VBFE4eQzRDJpU206LMXlWDlBU__92egaLgxeOSJH1VjPlZvBP_IJcwJI2ONVextaWJxPHtD2V16glRJI$",
  );
  expect(stripped.toString()).toBe("https://myaccount.microsoft.com/");
});

test("fails on an invalid inner URL in an URL Defense checked URL", () => {
  expect(() =>
    stripUrl(
      "https://urldefense.com/v3/__myaccount.microsoft.com/__;!!A4qNoLW32FtaT8k!XwN3YWhQ6OUWAI1MqCF0ZI-VBFE4eQzRDJpU206LMXlWDlBU__92egaLgxeOSJH1VjPlZvBP_IJcwJI2ONVextaWJxPHtD2V16glRJI$",
    ),
  ).toThrowError();
});

test("strips nested URL Defense URL in Outlook checked URL", () => {
  const stripped = stripUrl(
    "https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Furldefense.com%2Fv3%2F__https%3A%2Fmyaccount.microsoft.com%2F__%3B!!A4qNoLW32FtaT8k!XwN3YWhQ6OUWAI1MqCF0ZI-VBFE4eQzRDJpU206LMXlWDlBU__92egaLgxeOSJH1VjPlZvBP_IJcwJI2ONVextaWJxPHtD2V16glRJI%24&data=05%7C02%7Ccees.voesenek%40vortech.nl%7C03530e619c7b42478d3f08ddb7b15652%7C5fe8f8070fe44cdf8dc636475a0b8555%7C0%7C0%7C638868694495209971%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=R8VLzrOh2GErghblWHcL0DLCWKpJ1zmPNGlxgvMaugs%3D&reserved=0",
  );
  expect(stripped.toString()).toBe("https://myaccount.microsoft.com/");
});

test("fails on an invalid inner URL in an URL Defense URL nested in an Outlook checked URL", () => {
  expect(() =>
    stripUrl(
      "https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Furldefense.com%2Fv3%2F__myaccount.microsoft.com%2F__%3B!!A4qNoLW32FtaT8k!XwN3YWhQ6OUWAI1MqCF0ZI-VBFE4eQzRDJpU206LMXlWDlBU__92egaLgxeOSJH1VjPlZvBP_IJcwJI2ONVextaWJxPHtD2V16glRJI%24&data=05%7C02%7Ccees.voesenek%40vortech.nl%7C03530e619c7b42478d3f08ddb7b15652%7C5fe8f8070fe44cdf8dc636475a0b8555%7C0%7C0%7C638868694495209971%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=R8VLzrOh2GErghblWHcL0DLCWKpJ1zmPNGlxgvMaugs%3D&reserved=0",
    ),
  ).toThrowError();
});

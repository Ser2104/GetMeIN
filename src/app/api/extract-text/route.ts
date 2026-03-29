import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const fileName = file instanceof File ? file.name : "upload";
  const mimeType = file.type;
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";

  const isPdf = mimeType === "application/pdf" || extension === "pdf";
  const isDocx =
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === "docx";
  const isTxt = mimeType === "text/plain" || extension === "txt";

  if (!isPdf && !isDocx && !isTxt) {
    return NextResponse.json(
      {
        error: "Unsupported file type. Only PDF, DOCX, and TXT files are supported.",
      },
      { status: 415 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    let text = "";

    if (isPdf) {
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.js");
      const uint8Array = new Uint8Array(arrayBuffer);

      if ("GlobalWorkerOptions" in pdfjsLib) {
        (pdfjsLib as any).GlobalWorkerOptions.workerSrc = "";
      }

      const loadingTask = (pdfjsLib as any).getDocument({
        data: uint8Array,
        disableWorker: true,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
      });

      const pdf = await loadingTask.promise;
      let fullText = "";

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => {
          if (item && typeof item.str === "string") return item.str;
          return "";
        });
        fullText += strings.join(" ") + " ";
      }

      text = fullText;
    } else if (isDocx) {
      const mammoth = await import("mammoth");
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (isTxt) {
      const buffer = Buffer.from(arrayBuffer);
      text = buffer.toString("utf-8");
    }

    const cleanedText = text.replace(/\s+/g, " ").trim();

    if (!cleanedText || cleanedText.length < 20) {
      return NextResponse.json(
        { error: "Could not extract meaningful text from the file." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: cleanedText });
  } catch (err: any) {
    console.error("Text extraction error:", err);
    return NextResponse.json(
      {
        error: err?.message || "Failed to extract text from the file.",
      },
      { status: 500 }
    );
  }
}

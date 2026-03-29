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
    const buffer = Buffer.from(arrayBuffer);
    let text = "";

    if (isPdf) {
      const pdfParse = (await import("pdf-parse")).default;
      const result = await pdfParse(buffer);
      text = result.text;
    } else if (isDocx) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (isTxt) {
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
  } catch (err) {
    console.error("Text extraction error:", err);
    return NextResponse.json(
      { error: "Failed to extract text from the file." },
      { status: 500 }
    );
  }
}

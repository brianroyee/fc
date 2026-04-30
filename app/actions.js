"use server";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { headers } from "next/headers";

// ---------------------------------------------------------------------------
// Rate limiter – simple sliding-window, in-memory (resets on cold start,
// which is fine for serverless; prevents rapid abuse within a single instance).
// ---------------------------------------------------------------------------
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT = 5; // max submissions per window per IP
const hitMap = new Map(); // ip → [timestamps]

function isRateLimited(ip) {
  const now = Date.now();
  const hits = (hitMap.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  hitMap.set(ip, hits);
  return hits.length > RATE_LIMIT;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const MAX_STRING = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ANSWERS = new Set(["A", "B", "C", "D"]);
const EXPECTED_ANSWER_COUNT = 20;

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") return "Invalid payload.";

  const { applicant, answers, submittedAt } = payload;

  // -- applicant --
  if (!applicant || typeof applicant !== "object") return "Missing applicant data.";

  const requiredStrings = ["name", "email", "role", "profileUrl"];
  for (const field of requiredStrings) {
    if (typeof applicant[field] !== "string" || applicant[field].trim().length === 0) {
      return `Missing or invalid field: ${field}.`;
    }
    if (applicant[field].length > MAX_STRING) {
      return `Field too long: ${field}.`;
    }
  }

  if (!EMAIL_RE.test(applicant.email)) return "Invalid email format.";

  if (typeof applicant.phone !== "string") return "Invalid phone field.";
  if (applicant.phone.length > MAX_STRING) return "Phone too long.";

  // -- answers --
  if (!Array.isArray(answers) || answers.length !== EXPECTED_ANSWER_COUNT) {
    return `Expected ${EXPECTED_ANSWER_COUNT} answers.`;
  }
  for (let i = 0; i < answers.length; i++) {
    const a = answers[i];
    if (!a || typeof a !== "object") return `Invalid answer at index ${i}.`;
    if (typeof a.answer !== "string" || !VALID_ANSWERS.has(a.answer)) {
      return `Invalid answer value at index ${i}.`;
    }
    if (typeof a.response !== "string" || a.response.length > MAX_STRING) {
      return `Invalid response text at index ${i}.`;
    }
  }

  // -- timestamp --
  if (typeof submittedAt !== "string" || isNaN(Date.parse(submittedAt))) {
    return "Invalid submission timestamp.";
  }

  return null; // valid
}

// ---------------------------------------------------------------------------
// Main server action
// ---------------------------------------------------------------------------
export async function submitApplicationAction(payload) {
  try {
    // --- 1. Env-var guard ---------------------------------------------------
    const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      console.error("Missing required Google Sheets environment variables.");
      return { success: false, error: "Server configuration error. Please contact the administrator." };
    }

    // --- 2. Rate limit ------------------------------------------------------
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return { success: false, error: "Too many submissions. Please wait a minute and try again." };
    }

    // --- 3. Validate payload ------------------------------------------------
    const validationError = validatePayload(payload);
    if (validationError) {
      return { success: false, error: validationError };
    }

    // --- 4. Authenticate & write to sheet -----------------------------------
    const serviceAccountAuth = new JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // Build the canonical header list
    const expectedHeaders = [
      "Date",
      "Name",
      "Email",
      "Phone",
      "Role",
      "Profile URL",
      ...payload.answers.map((_, i) => `Question ${i + 1}`),
    ];

    // Always (re)set headers to guarantee all columns exist (e.g. Phone)
    let needsHeaderUpdate = true;
    try {
      await sheet.loadHeaderRow();
      // Check if existing headers match expected (order + count)
      needsHeaderUpdate =
        sheet.headerValues.length !== expectedHeaders.length ||
        !expectedHeaders.every((h, i) => sheet.headerValues[i] === h);
    } catch {
      // Sheet is empty / no header row yet
    }
    if (needsHeaderUpdate) {
      await sheet.setHeaderRow(expectedHeaders);
    }

    // Use object-based addRow keyed by header name (not positional)
    const rowData = {
      Date: payload.submittedAt,
      Name: payload.applicant.name,
      Email: payload.applicant.email,
      Phone: payload.applicant.phone,
      Role: payload.applicant.role,
      "Profile URL": payload.applicant.profileUrl,
    };
    payload.answers.forEach((a, i) => {
      rowData[`Question ${i + 1}`] = a.response;
    });

    await sheet.addRow(rowData);

    return { success: true };
  } catch (error) {
    // Log full error server-side; return safe message to client
    console.error("submitApplicationAction failed:", error);
    return { success: false, error: "Failed to submit application. Please try again." };
  }
}


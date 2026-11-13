export const ENQUIRY_TYPES = [
  "Product Enquiry",
  "Custom Artwork Request",
  "Price Enquiry",
  "International Shipping Enquiry",
  "Bulk Order Enquiry",
  "General Enquiry",
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];
export type EmailDeliveryStatus = "Pending" | "Sent" | "Failed";

type StoredProductDetails = {
  id: string;
  name: string;
  productCode: string;
  url: string;
  price: string | null;
};

export type StoredEnquiryDetails = {
  version: 1;
  enquiryType: EnquiryType;
  subject: string;
  message: string;
  additionalDetails: string[];
  emailDeliveryStatus: EmailDeliveryStatus;
  emailDeliveryNote: string;
  product?: StoredProductDetails;
};

const storageMarker = "ART_SQUARE_ENQUIRY_V1:";

export function serializeEnquiryDetails(details: StoredEnquiryDetails) {
  return `${storageMarker}${JSON.stringify(details)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function parseEnquiryDetails(value: string): StoredEnquiryDetails | null {
  if (!value.startsWith(storageMarker)) return null;

  try {
    const parsed: unknown = JSON.parse(value.slice(storageMarker.length));
    if (!isRecord(parsed) || parsed.version !== 1) return null;

    const enquiryType = ENQUIRY_TYPES.includes(parsed.enquiryType as EnquiryType)
      ? (parsed.enquiryType as EnquiryType)
      : "General Enquiry";
    const emailDeliveryStatus = parsed.emailDeliveryStatus === "Sent" || parsed.emailDeliveryStatus === "Pending"
      ? parsed.emailDeliveryStatus
      : "Failed";
    const productRecord = isRecord(parsed.product) ? parsed.product : null;
    const product = productRecord
      && typeof productRecord.id === "string"
      && typeof productRecord.name === "string"
      && typeof productRecord.productCode === "string"
      && typeof productRecord.url === "string"
      ? {
          id: productRecord.id,
          name: productRecord.name,
          productCode: productRecord.productCode,
          url: productRecord.url,
          price: typeof productRecord.price === "string" ? productRecord.price : null,
        }
      : undefined;

    return {
      version: 1,
      enquiryType,
      subject: typeof parsed.subject === "string" ? parsed.subject : "Customer enquiry",
      message: typeof parsed.message === "string" ? parsed.message : "",
      additionalDetails: Array.isArray(parsed.additionalDetails)
        ? parsed.additionalDetails.filter((item): item is string => typeof item === "string")
        : [],
      emailDeliveryStatus,
      emailDeliveryNote: typeof parsed.emailDeliveryNote === "string" ? parsed.emailDeliveryNote : "",
      product,
    };
  } catch {
    return null;
  }
}

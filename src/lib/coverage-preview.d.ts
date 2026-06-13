export type CoveragePreview = {
  metrics: Array<[string, string]>;
  chips: Array<{
    name: string;
    detail: string;
    status: string;
    tone: "full" | "partial";
  }>;
};

export function getCoveragePreview(): CoveragePreview;

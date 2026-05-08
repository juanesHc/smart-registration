import { ExtractedData } from './extracted-data.model';
import { ExtractionMetadata } from './extraction-metadata.model';

export interface ExtractionResponse {
  data: ExtractedData;
  extractedFields: string[];
  missingFields: string[];
  metadata: ExtractionMetadata;
}

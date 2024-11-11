// reportFactory.ts
import {
  type ReportTemplate,
  FullReport,
  ShortReport,
  FilteredReport,
  SalaryReport,
  type FilterableFields,
} from "./reportTemplates";

export class ReportFactory {
  static createReport(
    type: string,
    filterCriteria?: FilterableFields,
    filterValue?: string,
  ): ReportTemplate {
    switch (type.toLowerCase()) {
      case "full":
        return new FullReport();
      case "short":
        return new ShortReport();
      case "filtered":
        if (!filterCriteria || !filterValue) {
          throw new Error(
            "Filter criteria and value required for filtered report",
          );
        }
        return new FilteredReport(filterCriteria, filterValue);
      case "salary":
        return new SalaryReport();
      default:
        throw new Error("Invalid report type");
    }
  }
}

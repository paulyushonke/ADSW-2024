import { type Employee } from "../types";

// Define valid filter criteria type
export type FilterableFields = keyof typeof FILTER_OPTIONS;
export type FilterValues<T extends FilterableFields> =
  (typeof FILTER_OPTIONS)[T][number];
export const FILTER_OPTIONS = {
  gender: ["Male", "Female"] as const,
  progLang: ["Java", "Python", "PHP", ".NET", "JS", "C++"] as const,
  importance: ["High", "Medium", "Low"] as const,
} as const;

// Abstract Report Template using Template Method pattern
export abstract class ReportTemplate {
  // Template method defining the algorithm
  generateReport(employees: Employee[], author: string): string {
    return `${this.generateHeader()}
${this.generateData(employees)}
${this.generateFooter(author)}`;
  }

  // Abstract methods to be implemented by concrete classes
  protected abstract generateHeader(): string;
  protected abstract generateData(employees: Employee[]): string;

  // Common footer implementation
  protected generateFooter(author: string): string {
    return `\nPrepared by ${author}\nNational Technical University "Kharkiv Polytechnic Institute"`;
  }

  // Helper method to format date
  protected getFormattedDate(): string {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

// Full Report implementation
export class FullReport extends ReportTemplate {
  protected generateHeader(): string {
    return `FULL EMPLOYEE REPORT
Generated on: ${this.getFormattedDate()}
Entity: EMPLOYEE\n`;
  }

  protected generateData(employees: Employee[]): string {
    let result = "\nName\tBirthday\tGender\tSalary\tProg Lang\tImportance\n";
    result += "-".repeat(80) + "\n";

    employees.forEach((emp) => {
      result += `${emp.name}\t${emp.birthday}\t${emp.gender}\t${emp.salary}\t${emp.progLang}\t${emp.importance}\n`;
    });

    return result;
  }
}

// Short Report implementation
export class ShortReport extends ReportTemplate {
  protected generateHeader(): string {
    return `SHORT EMPLOYEE REPORT
Generated on: ${this.getFormattedDate()}
Entity: EMPLOYEE\n`;
  }

  protected generateData(employees: Employee[]): string {
    let result = "\nName\tSalary\tImportance\n";
    result += "-".repeat(40) + "\n";

    employees.forEach((emp) => {
      result += `${emp.name}\t${emp.salary}\t${emp.importance}\n`;
    });

    return result;
  }
}

// Filtered Report implementation
export class FilteredReport extends ReportTemplate {
  private filterCriteria: FilterableFields;
  private filterValue: string;

  constructor(filterCriteria: FilterableFields, filterValue: string) {
    super();
    this.filterCriteria = filterCriteria;
    this.filterValue = filterValue;
  }

  protected generateHeader(): string {
    return `FILTERED EMPLOYEE REPORT
Generated on: ${this.getFormattedDate()}
Filter: ${this.filterCriteria} = ${this.filterValue}
Entity: EMPLOYEE\n`;
  }

  protected generateData(employees: Employee[]): string {
    const filteredEmployees = employees.filter(
      (emp) => emp[this.filterCriteria] === this.filterValue,
    );

    let result = "\nName\tBirthday\tGender\tSalary\tProg Lang\tImportance\n";
    result += "-".repeat(80) + "\n";

    filteredEmployees.forEach((emp) => {
      result += `${emp.name}\t${emp.birthday}\t${emp.gender}\t${emp.salary}\t${emp.progLang}\t${emp.importance}\n`;
    });

    return result;
  }
}

// Salary Report implementation
export class SalaryReport extends ReportTemplate {
  protected generateHeader(): string {
    return `SALARY ANALYSIS REPORT
Generated on: ${this.getFormattedDate()}
Entity: EMPLOYEE\n`;
  }

  protected generateData(employees: Employee[]): string {
    const totalSalary = employees.reduce(
      (sum, emp) =>
        sum + parseFloat(emp.salary?.replace(/[^0-9.-]+/g, "") ?? "0"),
      0,
    );
    const avgSalary = totalSalary / employees.length;

    let result = "\nSALARY STATISTICS\n";
    result += "-".repeat(40) + "\n";
    result += `Total Employees: ${employees.length}\n`;
    result += `Total Salary: $${totalSalary.toFixed(2)}\n`;
    result += `Average Salary: $${avgSalary.toFixed(2)}\n\n`;

    result += "SALARY DISTRIBUTION\n";
    result += "-".repeat(40) + "\n";
    result += "Name\tSalary\n";

    employees
      .sort(
        (a, b) =>
          parseFloat(b.salary?.replace(/[^0-9.-]+/g, "") ?? "0") -
          parseFloat(a.salary?.replace(/[^0-9.-]+/g, "") ?? "0"),
      )
      .forEach((emp) => {
        result += `${emp.name}\t${emp.salary}\n`;
      });

    return result;
  }
}
